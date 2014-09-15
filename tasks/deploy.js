module.exports = function (grunt) {
    'use strict';

    // Internal lib.
    var gitDeploy = require('./lib/gitDeploy').init(grunt);

    grunt.registerTask('deploy', 'Deploy built project to Azure Website task', function () {
        var configFile = grunt.config('deploy.configFile'),
            branchName = gitDeploy.getBranchName(),
            deployURLs = gitDeploy.getDeployURLs(configFile, branchName);

        for (var i in deployURLs) {
            grunt.log.writeln(deployURLs[i]);
            gitDeploy.deploy(deployURLs[i], 'drop');
        }
    });
};