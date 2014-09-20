(function () {
    var app = angular.module('deltastartup', ['ui.router', 'deltastartup.services', 'Devise']);

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
            .state('apply', {
                url: "/apply",
                views: {
                    '': { templateUrl: "app/apply/apply.html" },
                    'jumbotron@apply': { templateUrl: "app/shared/jumbotron-other.html" }
                }
            })
            .state('sign_in', {
                url: "/sign_in",
                views: {
                    '': { templateUrl: "app/user/sign_in.html" },
                    'jumbotron@sign_in': { templateUrl: "app/shared/jumbotron-other.html" }
                }
            })
            .state('sign_up', {
                url: "/sign_up",
                views: {
                    '': { templateUrl: "app/user/sign_up.html" },
                    'jumbotron@sign_up': { templateUrl: "app/shared/jumbotron-other.html" }
                }
            })
    });

    app.config(function (AuthProvider) {
        AuthProvider.loginPath('/sign_in');
        AuthProvider.loginMethod('POST');
    });

    app.controller('appController', function ($scope, appService, Auth, $state) {
        $scope.login = function() {
            $state.go('sign_in');
            var credentials = {
                email: 'user@domain.com',
                password: 'password1'
            };

            Auth.login(credentials).then(function(user) {
                console.log(user); // => {id: 1, ect: '...'}
            }, function(error) {
                console.log(error);
            });
        }
    });

    app.service('appService', function() {
    });
}());
