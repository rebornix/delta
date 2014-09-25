(function () {

  var app = angular.module("deltastartup");

  app.controller('applyController', function (
      $scope, Auth, $http, $state, $window, linkedinService) {

    $scope.personalInfo = {};
    $scope.project = {};
    $scope.experiences = [];
    $scope.educations = [];

    $scope.$state = $state;

    $http.defaults.headers.put = {
      "Content-Type": "application/json"
    };

    var siteUri = "http://www.deltastartup.com:3000/";

    var userApplicationApi;

    Auth.currentUser().then(function(user) {
      var currentUser = Auth._currentUser;

      userApplicationApi = siteUri + "users/" + currentUser.id + "/";

      $http.get(userApplicationApi)
        .success(function (data, status, headers, config) {
          if (data.status === -1) {
            $state.go("apply.finished");
          }
          else {
            $scope.personalInfo.applicant_name = currentUser.applicant_name;
            $scope.personalInfo.wechat = currentUser.wechat;
            $scope.personalInfo.phone = currentUser.phone;

            $state.go(states[0]);
          }
        })
        .error(function (data, status, headers, config) {
          $.notify("Fail to fetch user information", "error");
        });

    }, function(error) {
        $state.go('sign_in');
    });

    var states = [
      // tentative
      "apply.one", "apply.two",
      "apply.three", "apply.four"
    ];

    $scope.submitPersonalInfo = function () {
      $http.put(userApplicationApi, $scope.personalInfo)
        .success(function (data, status, headers, config) {
          $.notify("Success to submit your personal information.", "success");
          $state.go(states[1]);
        })
        .error(function (data, status, headers, config) {
          $.notify("Fail to submit your personal information. Please try again.", "error");
        });

    };

    $scope.submitProject = function () {
      $http.post(userApplicationApi + "project/", $scope.project)
        .success(function (data, status, headers, config) {
          $.notify("Success to submit your project.", "success");
          $state.go(states[2]);
        })
        .error(function (data, status, headers, config) {
          $.notify("Fail to submit your project infomation. Please try again.", "error");
          $state.go(states[2]);
        });
    };

    $scope.submitExperience = function () {
      if ($scope.educations.length <=0 || $scope.experiences.length <= 0) {
        $window.alert("Make sure you fill both the experience and education.");
        return;
      }
      $http.post(userApplicationApi + "expers/")
        .success(function (data, status, headers, config) {
          $state.go(states[3]);
        })
        .error(function (data, status, headers, config) {
          $.notify("Fail to submit your experiences. Please try again.", "error");
        });
    };

    $scope.backToLastState = function (currentState) {
      $state.go(states[Math.max(0, states.indexOf(currentState) - 1)]);
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

    $scope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParams) {
      if (states.indexOf(fromState.name) < 0 || 
          (states.indexOf(fromState.name) > states.indexOf(toState.name))) {
        return false;   // TBD
      }

      switch (toState.name) {
        case states[1]:
          $http.get(userApplicationApi + "project/")
            .success(function (data, status, headers, config) {
              if (data.project) {
                var project = data.project;
                $scope.project.current_status = project.current_status;
                $scope.project.status_description = project.status_description;
                $scope.project.idea_description = project.idea_description;
              }
            })
            .error(function (data, status, headers, config) {
              $.notify("Fail to fetch your projects, Please try again.", "error");
            });
          break;
        case states[2]:
          $http.get(userApplicationApi + "expers/")
            .success(function (data, status, headers, config) {
              $scope.experiences = data.expers.experience || [];
              $scope.educations = data.expers.education || [];
            })
            .error(function (data, status, headers, config) {
              $.notify("Fail to fetch experiences, Please try again.", "error");
            });
          break;
        default:
          break;
      }
    });

  });

}());
