(function () {

  var app = angular.module('deltastartup');

  app.controller('signupCtrl', function ($scope) {
    $scope.professionExperiences = [{
      company: 'X',
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

  app.directive('editable', function () {
    return {
      restrict: 'AE',
      controller: function () {
        
      },
      link: function (scope, element, attr, ctrl) {
        scope.isEditable = false;

        scope.modify = function (experience) {
          scope.isEditable = true;
        };

        scope.update = function (experience) {
          scope.isEditable = false;
        };

        scope.delete = function (experience) {
        };
      }
    };
  });

})();
