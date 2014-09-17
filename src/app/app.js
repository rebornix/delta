(function() {
    var app = angular.module('deltastartup', ['ui.router', 'deltastartup.services']);

    app.config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('index', {
                url: "",
                templateUrl: "app/home/home.html"
            })
            .state('course', {
                url: "/course",
                templateUrl: "app/course/course.html"
            })
            .state('contact', {
                url: "/contact",
                templateUrl: "app/contact/contact.html"
            })
    });

    app.controller('appController', function($scope, appService) {

    });

    app.service('appService', function() {

    });
}());
