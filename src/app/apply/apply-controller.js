(function () {

  var app = angular.module("deltastartup");

  app.controller('applyController', function ($scope, Auth, $http, $state) {
    Auth.currentUser().then(function(user) {
        // User was logged in, or Devise returned
        // previously authenticated session.
        
    }, function(error) {
        $state.go('sign_in');
    });

  });

}());
