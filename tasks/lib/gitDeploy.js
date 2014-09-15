require('shelljs/global');

exports.init = function (grunt) {
    'use strict';

    var exports = {};

    exports.getBranchName = function () {
        var branchName = exec('git rev-parse --abbrev-ref HEAD 2>/dev/null', { silent: true })
                            .output.replace(/\n$/, '');

        branchName = grunt.option('branchName') || branchName;

        if (!branchName) {
            grunt.fail.fatal('Failed to get the branch name.');
        } else if (branchName === 'HEAD') {
            grunt.fail.fatal('Git repository is in detached mode, which does not belong to a specific branch.');
        } else {
            grunt.log.writeln('Branch: ' + branchName);
        }

        return branchName;
    };

    exports.getDeployURLs = function (configFile, branchName) {
        var deployConfig = grunt.file.readJSON(configFile);
        if (!deployConfig.git_url[branchName]) {
            grunt.fail.fatal('Failed to read the git repository URL for branch: ' + branchName);
        }

        return deployConfig.git_url[branchName];
    };

    exports.getE2EURL = function (configFile, branchName) {
        var deployConfig = grunt.file.readJSON(configFile),
            siteURLs = deployConfig.site_url[branchName];

        // If there are multiple site urls for a branch, choose the first one.
        if (siteURLs !== undefined && siteURLs.length > 0) {
            return siteURLs[0];
        }
        return undefined;
    };

    // Deploy the git repository 'drop_name' to target azure webiste endpoint 'git_url'
    exports.deploy = function (git_url, drop_name) {
        var splits = git_url.split("/"),
            dirName = splits[splits.length - 1];

        // pull latest builds or clone if repository doesn't exist
        if (test('-e', dirName)) {
            cd(dirName);
            exec('git pull');
        } else {
            var result = exec('git clone ' + git_url + ' ' + dirName);
            if (result.code !== 0) {
                grunt.fail.fatal('Failed to clone remote git repository');
            }
            cd(dirName);
        }

        var matches = pwd().match(dirName + "$");
        if (matches === null ||
            matches.length !== 1 ||
            matches[0] !== dirName) {
            grunt.fail.fatal('Direcotry [' + dirName + '] does not exist for deploy');
        }

        // remove all files except git history
        ls('-A', '*').forEach(function (file) {
            if (file !== '.git') {
                rm('-rf', file);
            }
        });

        // add new published files
        cp('-rf', '../' + drop_name + '/*', '.');
        // TODO: Check it if it's true before run the command.
        exec('git config core.autocrlf false');
        exec('git add --all');
        exec('git commit --allow-empty -m "grunt deploy"');
        // current: push the current branch to a branch of the same name.
        exec('git config push.default current');
        exec('git push');

        // Exit the current distribution directory for loop deployment.
        cd('..');
    };

    return exports;
};