(function () {

  var app = angular.module("deltastartup");

  app.controller('applyController', function ($scope, Auth, $http, $state, linkedinService) {
    /*
    Auth.currentUser().then(function(user) {
        // User was logged in, or Devise returned
        // previously authenticated session.
        
    }, function(error) {
        $state.go('sign_in');
    });
    */

    $scope.$state = $state;

    var states = [
      // tentative
      'apply.one', 'apply.two',
      'apply.three', 'apply.four'
    ];

    var stateManager = (function () {

      var step = 0;

      return {
        completeState: function (state) {
          step = Math.max(step, states.indexOf(state));
        },
        revokeState: function (state) {
          var index = states.indexOf(state);
          if (index >= 0) {
            step = Math.min(step, index)
          }
        },
        isStateAvailable: function (state) {
          return states.indexOf(state) <= step;
        }
      };
    
    })();

    $http.get('app/apply/json/application.json').success(function (data, status, headers, config) {
      $scope.personalInfo = data.personalInfo;
      $scope.experiences = data.experiences;
      $scope.educations = data.educations;
      $scope.status = data.status;
    });

    $scope.isStateAvailable = function (state) {
      return stateManager.isStateAvailable(state);
    };

    $scope.submitPersonalInfo = function () {
      /*
      $http.post().success(function () {
      
      });
      */
      stateManager.completeState(states[0]);
      $state.go(states[1]);
    };

    $scope.submitCurrentStatus = function () {
      /*
      $http.post().success(function () {
      
      });
      */
      stateManager.completeState(states[1]);
      $state.go(states[2]);
    };

    $scope.backToLastState = function (currentState) {
      $state.go(states[Math.max(0, states.indexOf(currentState) - 1)]);
    };

    $scope.submitExperience = function () {
      /*
      $http.post().success(function () {
      
        $state.go(states[3]);
      });
      */
      stateManager.completeState(states[2]);
      $state.go(states[3]);
    };

    linkedinService.initialize();
    $scope.importFromLinkedIn = function() {
        linkedinService.connectLinkedin().then(linkedinService.getProfile).then(function(data) {
            console.log(data);
        });
    };

    $scope.addExperience = function (experience) {
    };

    $scope.saveExperience = function (experience) {
    };

    $scope.removeExperience = function (experience) {
      $scope.experiences.splice($scope.experiences.indexOf(experience), 1);
    };

    $scope.addEducation = function () {
    
    };

    $scope.saveEducation = function (education) {
    };

    $scope.removeEducation = function (education) {
      $scope.educations.splice($scope.educations.indexOf(education), 1);
    };

  });

}());
