(function () {

  var app = angular.module("deltastartup");

  app.controller('applyController', function ($scope) {
    $scope.educationExperiences = [{
      isInEditingState: false,
      entry: {
        where: 'EPFL',
        duration: '2009.08 - 2013.07',
        degree: 'Bachelor of Engineering',
        description: 'Computer Science'
      }
    }, {
      isInEditingState: false,
      entry: {
        where: 'HUST',
        duration: '2012.03 - 2014.03',
        degree: 'Master of Compute Science',
        description: 'Computer Science'
      }
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

  app.controller('educationController', function ($scope) {
  
  });


}());
