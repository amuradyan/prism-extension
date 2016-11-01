var mainModule = angular.module('mainModule', ['ngRoute', 'ngResource']);

mainModule.config(['$routeProvider', '$logProvider', function ($routeProvider, $logProvider) {
    $logProvider.debugEnabled(true);
    console.log("in main module config")

    $routeProvider
        .when('/', {
            templateUrl: 'app/components/login/login-template.html',
            controller: 'login',
            controllerAs: 'ctrl'
        })
        .otherwise('/');
}]);