(function() {
    var app = angular.module('deltastartup');

    app.controller('contactController', function($scope, $rootScope, Auth, $http, $state) {
        $scope.feedback = {
            email: '',
            description: ''
        };

        if (Auth._currentUser != null) {
            $scope.feedback.email = Auth._currentUser.email;
        }

        $scope.$on('login', function(e,d) {
            $scope.feedback.email = Auth._currentUser.email;
        });

        $scope.contact = function() {
            var userApplicationApi = $rootScope.uri + "/contact";
            $http.post(userApplicationApi, $scope.feedback)
            .success(function (data, status, headers, config) {
              $.notify("我们已经收到你的反馈.", "success");
              $state.go('index');
            })
            .error(function (data, status, headers, config) {
              $.notify("Fail to submit your feedback. Please try again.", "error");
            });
        };
    });
}());
