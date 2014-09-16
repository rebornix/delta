
# Delta Startup ![Build Status](https://travis-ci.org/rebornix/delta.svg?branch=master) ![Dependence](https://david-dm.org/rebornix/delta.png) ![DevDependence](https://david-dm.org/rebornix/delta/dev-status.png)

# Get involved in development
## Setup env
### Windows
- Download source code from github
- Invode cmd as administrator then run ``` /yourpath/delta/tool/DevEnvSetup.cmd ```
- Inside the local folder of this repo, run `npm` to install everything we need 
  - `npm install`

### Mac/*inx
- install *git* and clone the appropriate branch
 - ```git clone --branch master https://github.com/rebornix/IssueMan.git issueman```
- install *node*
- launch terminal and install the following packages in the global space: *grunt-cli*, *bower*
 - `npm install -g grunt-cli`
 - `npm install -g bower`
- inside the local folder of source repositry run *npm* to install everything we need
 - `npm install`
- You can run grunt tasks and do development as usual.

### Grunt task
- `grunt dev`
 - Build the source code using development settings and start the HTTP server for debugging.
 - You can access http://localhost:9000 and enjoy your debugging.
- `grunt prod`
 - Build the source code using production settings and generate bits for deployment
 - All css and js files are merged and minified

# Credit
- The whole grunt world