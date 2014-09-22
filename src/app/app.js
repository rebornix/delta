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
            // apply
            .state('apply', {
                url: "/apply",
                abstract: true,
                controller: 'applyController',
                views: {
                    '': { templateUrl: "app/apply/apply.html" },
                    'jumbotron@apply': { templateUrl: "app/shared/jumbotron-other.html" }
                }
            })
                .state('apply.step1', {
                    url: "/step-one/",
                    templateUrl: "app/apply/partials/personal-info.html"
                })
                .state('apply.step2', {
                    url: "/step-two/",
                    templateUrl: "app/apply/partials/current-status.html"
                })
                .state('apply.step3', {
                    url: "/step-three/",
                    templateUrl: "app/apply/partials/experience.html"
                })
                .state('apply.step4', {
                    url: "/step-four/",
                    templateUrl: "app/apply/partials/examination.html"
                })

            //
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
        ;

        $urlRouterProvider
            .when('/apply', '/apply/step-one/');
    });

    app.config(function (AuthProvider) {
        AuthProvider.loginPath('/sign_in');
        AuthProvider.loginMethod('POST');
        AuthProvider.registerPath('sign_up');
        AuthProvider.registerMethod('POST');
    });

    app.controller('appController', function ($scope, appService, Auth, $state) {
        $scope.sessionBtn = Auth.isAuthenticated() ? "app/user/sign_out_btn.html": "app/user/sign_in_btn.html";

        $scope.credentials = {
            email: '',
            password: '',
            password_confirmation: ''
        };

        $scope.login = function () {
            Auth.login($scope.credentials).then(function(user) {
                $state.go('apply');
            }, function(error) {
                console.log(error);
            });
        };

        $scope.logout = function () {
            Auth.logout().then(function(oldUser) {
               // alert(oldUser.name + "you're signed out now.");
            }, function(error) {
                // An error occurred logging out.
            });
        };

        $scope.register = function () {
            Auth.register($scope.credentials).then(function(registeredUser) {
                $state.go('apply');
            }, function(error) {
                // Registration failed...
            });

            $scope.$on('devise:new-registration', function(event, user) {
                // ...
            });
        };

        $scope.$on('devise:new-session', function(event, currentUser) {
            // user logged in by Auth.login({...})
            $scope.sessionBtn = "app/user/sign_out_btn.html";
        });

        $scope.$on('devise:logout', function(event, oldCurrentUser) {
            // ...
            $scope.sessionBtn = "app/user/sign_in_btn.html";
        });
    });

    app.service('appService', function() {

    });
}());
