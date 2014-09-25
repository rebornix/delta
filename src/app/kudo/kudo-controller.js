(function() {
    var app = angular.module('deltastartup');

    app.controller('kudoController', ['$scope', 'kudoService', function($scope, kudoService){
        kudoService.get( function(data){
            $scope.data = data;
        });
    }]);
}());
