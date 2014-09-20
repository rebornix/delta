(function () {
    var app = angular.module('deltastartup', ['ui.router', 'deltastartup.services']);

    app.config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('index', {
                url: "",
                views: {
                    '': { templateUrl: "app/home/home.html" },
                    'jumbotron@index': { templateUrl: "app/shared/jumbotron-home.html" }
                }
            })
            .state('course', {
                url: "/course",
                views: {
                    '': { templateUrl: "app/course/course.html" },
                    'jumbotron@course': { templateUrl: "app/shared/jumbotron-other.html" }
                }
            })
            .state('contact', {
                url: "/contact",
                views: {
                    '': { templateUrl: "app/contact/contact.html" },
                    'jumbotron@contact': { templateUrl: "app/shared/jumbotron-other.html" }
                }
            })
            .state('signup', {
                url: "/signup",
                views: {
                    '': { templateUrl: "app/signup/signup.html" },
                    'jumbotron@signup': { templateUrl: "app/shared/jumbotron-other.html" }
                }
            })
    });

    app.controller('appController', function($scope, appService) {

    });

    app.service('appService', function() {

    });
}());
