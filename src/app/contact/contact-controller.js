(function() {
    var app = angular.module('deltastartup');

    app.controller('contactController', function($scope, $rootScope, Auth, $http, $state, $modal) {
        $scope.feedback = {
            email: '',
            name: '',
            description: ''
        };

        if (Auth._currentUser != null) {
            $scope.feedback.email = Auth._currentUser.email;
            $scope.feedback.name = Auth._currentUser.applicant_name;
        }

        $scope.$on('login', function(e,d) {
            $scope.feedback.email = Auth._currentUser.email;
            $scope.feedback.name = Auth._currentUser.applicant_name;
        });

        $scope.contact = function() {
            var userApplicationApi = $rootScope.uri + "/contact";
            var feedback = $scope.feedback
            $http.post(userApplicationApi, $scope.feedback)
                .success(function (data, status, headers, config) {
                    $modal.open({
                        templateUrl: 'app/contact/success_modal.html',
                        controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
                            $scope.ok = function () {
                                $modalInstance.close();
                                feedback.description = "";
                            };
                        }]
                    })
                })
                .error(function (data, status, headers, config) {
                    $.notify("Fail to submit your feedback. Please try again.", "error");
                });
        };
    });
}());
