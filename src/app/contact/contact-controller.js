(function() {
    var app = angular.module('deltastartup');

    app.controller('contactController', function($scope, Auth) {
        $scope.feedback = {
            email: '',
            description: ''
        };

        if (Auth._currentUser != null) {
            $scope.feedback.email = Auth._currentUser.email;
        }

        $scope.contact = function() {
            
        }
    }); 
}());