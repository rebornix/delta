(function () {

  var app = angular.module("deltastartup");

  app.controller('stageController', function ($scope) {
    $scope.currentStage = 1;

    $scope.setCurrentStage = function (stage) {
      $scope.currentStage = stage;
    };
  });

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

  });


  app.controller('professionController', function ($scope) {
    var isInEditingState = false;

    $scope.professionExperiences = [];

    $scope.importFromLinkedIn = function () {
      angular.forEach([{
        isInEditingState: false,
        entry: {
          where: 'Xero',
          duration: '2012.03 - 2014.03',
          title: 'Full Stack Engineer',
          description: 'Requirement, Designing, Programming, Testing, Integration, Sales, etc...'
        }
      }, {
        isInEditingState: false,
        entry: {
          where: 'Google',
          duration: '2012.03 - 2014.03',
          title: 'Dev',
          description: 'None'
        }
      }], function (experience) {
        $scope.professionExperiences.push(experience);
      });
    };

    $scope.addExperience = function () {
      if (isInEditingState) {
      
      }
    };
    
  });

  app.controller('currentStatusController', function ($scope) {
  
  });

  app.controller('educationController', function ($scope) {
  
  });

  app.controller('personalInfoController', function ($scope) {
  
  });


}());
