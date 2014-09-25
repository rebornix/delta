(function () {

  var app = angular.module("deltastartup");

  app.controller('applyController', function ($scope, Auth, $http, $state, $window, linkedinService) {
    Auth.currentUser().then(function(user) {
        // User was logged in, or Devise returned
        // previously authenticated session.
        console.log(Auth._currentUser);

    }, function(error) {
        $state.go('sign_in');
    });

    $scope.$state = $state;

    $scope.personalInfo = {};
    $scope.currentStatus = {};
    $scope.experiences = [];
    $scope.educations = [];

    var states = [
      // tentative
      'apply.one', 'apply.two',
      'apply.three', 'apply.four'
    ];

    $scope.isStateAvailable = function (state) {
      return stateManager.isStateAvailable(state);
    };

    $scope.submitPersonalInfo = function () {
      $http.put("http://www.deltastartup.com:3000/users/1/", $scope.personalInfo, { headers: { 'Content-Type': 'application/json' }})
        .success(function (data, status, headers, config) {
          $state.go(states[1]);
        })
        .error(function (data, status, headers, config) {
          $state.go(states[1]);
        });
    };

    $scope.submitCurrentStatus = function () {
      $http.put("http://www.deltastartup.com/users/1/", $scope.currentStatus)
        .success(function (data, status, headers, config) {
          stateManager.completeState(states[1]);
          $state.go(states[2]);
        })
        .error(function () {
        });
    };

    $scope.backToLastState = function (currentState) {
      $state.go(states[Math.max(0, states.indexOf(currentState) - 1)]);
    };

    $scope.submitExperience = function () {
      if ($scope.educations.length <=0 || $scope.experiences.length <= 0) {
        $window.alert("Make sure you fill both the experience and education.");
        return;
      }
      $http.post("http://www.deltastartup.com/users/1/").success(function () {
        $state.go(states[3]);
      });
    };

    linkedinService.initialize();
    $scope.importFromLinkedIn = function() {
        linkedinService.connectLinkedin().then(linkedinService.getProfile).then(function(data) {
            console.log(data);
        });
    };

    $scope.addExperience = function (experience) {
      $scope.experiences.push({});
    };

    $scope.saveExperience = function (experience) {
      // fake
      /*
      $http.post().success(function () {

      });
      */
    };

    $scope.removeExperience = function (experience) {
      if ($window.confirm("确认删除？") === true) {
        $scope.experiences.splice($scope.experiences.indexOf(experience), 1);
      }
    };

    $scope.addEducation = function () {
      $scope.educations.push({});
    };

    $scope.saveEducation = function (education) {
      // fake
      /*
      $http.post().success(function () {

      });
      */
    };

    $scope.removeEducation = function (education) {
      if ($window.confirm("确认删除？") === true) {
        $scope.educations.splice($scope.educations.indexOf(education), 1);
      }
    };

  });

}());
