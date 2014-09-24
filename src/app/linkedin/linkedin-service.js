(function() {
    var services = angular.module('deltastartup.services');

    services.factory('linkedinService', function($q) {

        var authorizationResult = false;

        return {
            initialize: function() {
                OAuth.initialize('t25cjY_4rWYhcgHC96HLsIb-d90', {cache:true,'scope':'r_fullprofile'});
                authorizationResult = OAuth.create('linkedin');
            },
            isReady: function() {
                return (authorizationResult);
            },
            connectLinkedin: function() {
                var deferred = $q.defer();
                OAuth.popup('linkedin', {cache:true}, function(error, result) {
                    if (!error) {
                        authorizationResult = result;
                        deferred.resolve();
                    } else {
                        //do something if there's an error
                    }   
                });
                return deferred.promise;
            },
            clearCache: function() {
                OAuth.clearCache('linkedin');
                authorizationResult = false;
            },
            getProfile: function (order, state) {
                return authorizationResult.get('https://api.linkedin.com/v1/people/~:(positions:(id,title,summary,start_date,is-current,end_date,company:(id,name)),educations)?format=json').done(function(data) {
                    return data;
                });
            }
        };
    });
}());