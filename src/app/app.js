(function () {
    var app = angular.module('deltastartup', ['ui.router', 'ui.bootstrap','deltastartup.services', 'Devise', 'ngRetina']);

    //var uri = 'http://0.0.0.0:3000'
    var uri = 'http://www.deltastartup.com:3000'

    //Add this to have access to a global variable
    app.run(function ($rootScope) {
        $rootScope.uri = uri;
    });

    app.config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
        $httpProvider.defaults.headers.common["Content-Type"] = "application/json";
        $httpProvider.defaults.headers.common["Accept"] = "application/json";
        $httpProvider.defaults.withCredentials = true;
    }]);

    app.applyTemplateProvider = ['$http', '$state', 'Auth', function($http, $state, Auth) {
         return Auth.currentUser().then(function(user) {
          return $http.get('app/apply/apply.html').then(function (response) {
              return response.data;
          });
        }, function(error) {
            //$.notify("请先注册登录");
            $state.go('sign_up');
        });
    }];

    app.userTemplateProvider = function (viewName) {
        return ['$http', '$state', 'Auth', function($http, $state, Auth) {
            return Auth.currentUser().then(function(user) {
                    window.location = '/';
                }, function(error) {
                    return $http.get(viewName).then(function (response) {
                        return response.data;
                    }
                );
            });
        }];
    };

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
                    '': { templateProvider: app.applyTemplateProvider },
                    'jumbotron@apply': { templateUrl: "app/shared/jumbotron-other.html" }
                }
            })
                .state('apply.finished', {
                  url: "/finished/",
                  templateUrl: "app/apply/apply-finished.html"
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
                    url: '/choose-ticket',
                    templateUrl: 'app/apply/partials/choose-ticket.html'
                })
                .state('apply.five', {
                    url: "/finish/",
                    templateUrl: "app/apply/partials/examination.html"
                })

            .state('sign_in', {
                url: "/sign_in",
                views: {
                    '': { templateProvider: app.userTemplateProvider("app/user/sign_in.html") },
                    'jumbotron@sign_in': { templateUrl: "app/shared/jumbotron-other.html" }
                }
            })
            .state('sign_up', {
                url: "/sign_up",
                views: {
                    '': { templateProvider: app.userTemplateProvider("app/user/sign_up.html") },
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
        $urlRouterProvider.when('/apply', '/apply/personal-info/');

        $urlRouterProvider.otherwise("/404");
    });

    app.config(function (AuthProvider) {
        AuthProvider.loginPath(uri + '/account/sign_in');
        AuthProvider.loginMethod('POST');
        AuthProvider.registerPath(uri + '/account');
        AuthProvider.registerMethod('POST');
        AuthProvider.logoutPath(uri + '/account/sign_out');
        AuthProvider.logoutMethod('DELETE');
        AuthProvider.parse(function(response){
            return response.data.user;
        });
    });

    app.controller('appController', function ($scope, appService, Auth, $state) {
        Auth.currentUser().then(function(user){
            console.log(Auth.isAuthenticated());
            if (Auth.isAuthenticated()) {
                $scope.$broadcast('login', 'true');
            }
            $scope.sessionBtn = Auth.isAuthenticated() ? "app/user/sign_out_btn.html": "app/user/sign_in_btn.html";
        });
        $scope.sessionBtn = Auth.isAuthenticated() ? "app/user/sign_out_btn.html": "app/user/sign_in_btn.html";

        $scope.$state = $state;

        $scope.credentials = {
            email: '',
            password: '',
            password_confirmation: ''
        };

        $scope.login = function () {
            Auth.login($scope.credentials).then(function(user) {
                $state.go('apply.three');
                //$.notify('login succeed', 'success');
            }, function(error) {
                $.notify("登录失败: 用户名和密码不匹配", 'warn');
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
                Auth.login($scope.credentials).then(function() {
                    $state.go('apply.one');
                }, function(error){
                    $.notify("注册失败: ，该账户已经存在", 'warn');
                });
            }, function(error) {
                $.notify("注册失败", 'warn');
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
