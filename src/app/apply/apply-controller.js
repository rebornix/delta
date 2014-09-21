(function () {

  var app = angular.module("deltastartup");

  app.controller('applyController', function ($scope, Auth, $state) {
      Auth.currentUser().then(function(user) {
          // User was logged in, or Devise returned
          // previously authenticated session.
          
      }, function(error) {
          $state.go('sign_in');
      });

    $scope.professionExperiences = [{
      company: 'Xero',
      duration: '2012.03 - 2014.03',
      title: 'Full Stack Engineer',
      description: 'Requirement, Designing, Programming, Testing, Integration, Sales, etc...'
    }, {
      company: 'Google',
      duration: '2012.03 - 2014.03',
      title: 'Dev',
      description: 'None'
    }];

    $scope.educationExperiences = [{
      where: 'EPFL',
      duration: '2009.08 - 2013.07',
      degree: 'Bachelor of Engineering',
      description: 'Computer science.'
    }, {
      company: 'Google',
      duration: '2012.03 - 2014.03',
      title: 'Dev',
      description: 'None'
    }];

    this.delete = function () {
      $scope.professionExperiences.splice(1);
    };

  });


}());
