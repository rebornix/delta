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

  app.directive('retina', ['$window', function ($window) {
    var isRetina = (function() {
      var mediaQuery = "(-webkit-min-device-pixel-ratio: 1.5), (min--moz-device-pixel-ratio: 1.5), " +
        "(-o-min-device-pixel-ratio: 3/2), (min-resolution: 1.5dppx)";
      if ($window.devicePixelRatio > 1)
        return true;
      return ($window.matchMedia && $window.matchMedia(mediaQuery).matches);
    })();

    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        if (isRetina) {
          element.attr('class', attrs.class + "2x");        
        }
      }
    };
  }]);

}());
