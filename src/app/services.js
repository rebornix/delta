(function () {
   var services = angular.module('deltastartup.services', []);

   services.factory('appService', ['$http',
        function() {
            var appService = {
                currentUser = null;
            };

            return appService;
        }
    ]);
}());