(function () {
    var app = angular.module('deltastartup', ['ui.router', 'deltastartup.services', 'Devise']);

    app.config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
        $httpProvider.defaults.headers.common["Content-Type"] = "application/json";
        $httpProvider.defaults.headers.common["Accept"] = "application/json";
    }
    ]);
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
            .state('kudo', {
                url: "/kudo",
                views: {
                    '': { templateUrl: "app/kudo/kudo.html" },
                    'jumbotron@kudo': { templateUrl: "app/shared/jumbotron-other.html" }
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
                .state('apply.one', {
                    url: "/personal-info/",
                    templateUrl: "app/apply/partials/personal-info.html"
                })
                .state('apply.two', {
                    url: "/current-status/",
                    templateUrl: "app/apply/partials/current-status.html"
                })
                .state('apply.three', {
                    url: "/experience/",
                    templateUrl: "app/apply/partials/experience.html"
                })
                .state('apply.four', {
                    url: "/finish/",
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
            .state('404', {
                url: "/404",
                views: {
                    '': { templateUrl: "app/misc/404.html" },
                    'jumbotron@404': { templateUrl: "app/shared/jumbotron-other.html" }
                }
            });

        $urlRouterProvider
            .when('/apply', '/apply/personal-info/');

        $urlRouterProvider.otherwise("/404");
    });

    app.config(function (AuthProvider) {
        AuthProvider.loginPath('http://www.deltastartup.com:3000/account/sign_in');
        AuthProvider.loginMethod('POST');
        AuthProvider.registerPath('http://www.deltastartup.com:3000/account/sign_up');
        AuthProvider.registerMethod('POST');
        AuthProvider.logoutPath('http://www.deltastartup.com:3000/account/sign_out');
        AuthProvider.logoutMethod('DELETE');
        AuthProvider.parse(function(response){
            return response.data.user;
        });
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
                $state.go('apply.one');
                $.notify('login succeed', 'success');
            }, function(error) {
                $.notify(error, 'success');
                console.log(error);
            });
        };

        $scope.logout = function () {
            Auth.logout().then(function(oldUser) {
               $state.go('index');
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

        $scope.$on('devise:unauthorized', function(event, xhr, deferred) {
            //TODO, try to login again
            deferred.reject(xhr.data.info);
        });
    });

    app.service('appService', function() {

    });
}());
