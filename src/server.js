(function () {
    'use strict';

    var express = require('express');
    var http = require('http');
    var url = require('url');
    var xml2js = require('xml2js');
    var cors = require('cors');
    var fs = require('fs');
    var path = require('path');

    var app = express();

    app.configure(function () {
        app.set('port', process.env.PORT || 9000);
        app.use(express.logger('dev'));
        app.use(express.bodyParser());
        app.use(express.methodOverride());
        app.use(express.cookieParser());
        app.use(app.router);
        app.use('/', express.static(__dirname + '/'));
        // CORS related configurations.
        app.use(cors());
        app.use(app.router);
    });

    http.createServer(app).listen(app.get('port'), function () {
        console.log("Express server listening on port " + app.get('port'));
    });

}());