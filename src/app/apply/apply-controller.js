(function () {

  var app = angular.module("deltastartup");

  app.controller('applyController', function (
      $scope, $rootScope, Auth, $http, $state, $window, linkedinService, $modal) {

    $scope.personalInfo = {};
    $scope.project = {};
    $scope.experiences = [];
    $scope.ticket = "basic";
    $scope.educations = [];

    $scope.$state = $state;

    var userApplicationApi;

    var states = [
      // tentative
      "apply.one", "apply.two",
      "apply.three", "apply.four", "apply.five"
    ];


    Auth.currentUser().then(function(user) {
      var currentUser = Auth._currentUser;

      userApplicationApi = $rootScope.uri + "/user/";

      $http.get(userApplicationApi)
        .success(function (data, status, headers, config) {
          if (data.status === -1) {
              $state.go("apply.finished");
          }
          else {
            $scope.personalInfo.applicant_name = currentUser.applicant_name;
            $scope.personalInfo.wechat = currentUser.wechat;
            $scope.personalInfo.phone = currentUser.phone;
            $scope.ticket = currentUser.ticket;
            if(currentUser.ticket){
                $state.go(states[4])
            } else{
                $state.go(states[0]);
            }
          }
        })
        .error(function (data, status, headers, config) {
            //$.notify("Fail to fetch user information", "error");
        });

    }, function(error) {
        $state.go('sign_in');
    });

    // Personal Info
    $scope.submitPersonalInfo = function () {
      $http.put(userApplicationApi, $scope.personalInfo)
        .success(function (data, status, headers, config) {
          $state.go(states[1]);
        })
        .error(function (data, status, headers, config) {
            //$.notify("Fail to submit your personal information. Please try again.", "error");
        });

    };

    // Project
    $scope.submitProject = function () {
      success_func = function (data, status, headers, config) {
        $state.go(states[2]);
      }
      error_func = function (data, status, headers, config) {
        //$.notify("Fail to submit your project infomation. Please try again.", "error");
        $state.go(states[1]);
      }
      url = userApplicationApi + "project/"
      if ($scope.project.id == null){
        $http.post(url, $scope.project).success(success_func).error(error_func);
      }else{
        $http.put(url, $scope.project).success(success_func).error(error_func);
      }
    };

    // Experience
    $scope.startDate = new Date();
    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    $scope.submitExperience = function () {
      if ($scope.educations.length <= 0 && $scope.experiences.length <= 0) {
          $modal.open({
          templateUrl: 'app/apply/partials/submit-warning.html',
          controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
            $scope.ok = function () {
              $modalInstance.close();
            };
          }]
        });
      }

      sucss_func = function (data, status, headers, config) {
          $state.go(states[3]);
      }
      error_func = function (data, status, headers, config) {
          //$.notify("Fail to submit your experiences. Please try again.", "error");
      }
      url = userApplicationApi + "expers";
      var post_data = []; var put_data = [];
      for(var i = 0; i < $scope.experiences.length; i++){
        item  = $scope.experiences[i]
        if (item.id == null){
          post_data.push(item)
        }else{
          put_data.push(item)
        }
      }
      for(var i = 0; i < $scope.educations.length; i++){
        item  = $scope.educations[i]
        if (item.id == null){
          post_data.push(item)
        }else{
          put_data.push(item)
        }
      }

      if(post_data.length > 0)
        $http.post(url, post_data).success(sucss_func).error(error_func);
      if(put_data.length > 0)
        $http.put(url+ "/update_all", put_data).success(sucss_func).error(error_func);
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

    function removeExp(experience) {
        $scope.experiences.splice($scope.experiences.indexOf(experience), 1);
    }

    $scope.removeExperience = function (experience) {
      $modal.open({
        templateUrl: 'app/apply/partials/delete-entry.html',
        controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {

          $scope.ok = function () {
            removeExp(experience);
            $modalInstance.close();
          };

          $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
          };
        }]
      });
    };

    // Ticket info
    $scope.submitTicketInfo = function (ticket) {
        sucss_func = function (data, status, headers, config) {
            $state.go(states[4]);
        }
        error_func = function (data, status, headers, config) {
            //$.notify("Fail to submit your ticket info. Please try again.", "error");
        }

        $modal.open({
            templateUrl: 'app/apply/partials/confirm-modal.html',
            controller: ['$scope', '$modalInstance',  function ($scope, $modalInstance) {
                $scope.ok = function () {
                    url = userApplicationApi + 'ticket'
                    $http.put(url, {ticket: ticket}).success(sucss_func).error(error_func);
                    $modalInstance.close();
                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            }]
        });
    };

    $scope.backToLastState = function (currentState) {
      $state.go(states[Math.max(0, states.indexOf(currentState) - 1)]);
    };

    // Education
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

    function removeEdu(education) {
        $scope.educations.splice($scope.educations.indexOf(education), 1);
    }

    $scope.removeEducation = function (education) {
      $modal.open({
        templateUrl: 'app/apply/partials/delete-entry.html',
        controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {

          $scope.ok = function () {
            removeEdu(education);
            $modalInstance.close();
          };

          $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
          };
        }]
      });
    };

    $scope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParams) {
      if (states.indexOf(fromState.name) < 0 ||
          (states.indexOf(fromState.name) > states.indexOf(toState.name))) {
        return false;   // TBD
      }

      switch (toState.name) {
        case states[1]:
          $http.get(userApplicationApi + "project/")
            .success(function (project, status, headers, config) {
              if (project) {
                $scope.project.id = project.id
                $scope.project.current_status = project.current_status;
                $scope.project.status_description = project.status_description;
                $scope.project.idea_description = project.idea_description;
              }
            })
            .error(function (data, status, headers, config) {
                //$.notify("Fail to fetch your projects, Please try again.", "error");
            });
          break;
        case states[2]:
          $http.get(userApplicationApi + "expers/")
            .success(function (data, status, headers, config) {
              if (data.length != 0) {
                $scope.experiences = data.expers || [];
                $scope.educations = data.edus || [];
              }
            })
            .error(function (data, status, headers, config) {
              //$.notify("Fail to fetch experiences, Please try again.", "error");
            });
          break;
        default:
          break;
      }
    });

  });

}());
