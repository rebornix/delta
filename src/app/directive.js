(function () {

  var app = angular.module('deltastartup');

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

}());
