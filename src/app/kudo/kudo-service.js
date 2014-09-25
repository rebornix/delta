(function() {
    var services = angular.module('deltastartup.services');
    services.factory("kudoService", ['$http', function($http){
        return {
            get: function(callback){
                $http.get('http://127.0.0.1:3000/kudo.json').success(function(data){
                    callback(data);
                });
            }
        };
    }]);

}());
