angular.module('mainModule')
.factory('prdAuthService', ['$rootScope', '$http', '$location', 'userService',
                    function ($rootScope, $http, $location, userService) {

    var config = {
        headers : {
            'Content-Type' : 'application/json'
        }
    }

    var fb_logged_in = false;
    var token = {token_id: '', expiry: ''};

    return {
        checkLoginState :function () {
            alert("in checkLoginState");
            console.log("in checkLoginState");
            FB.getLoginStatus(function(response) {
                statusChangeCallback(response);
            });
        },

        login: function (credentials) {
            console.log("login with credentials", credentials);

            $http.post('/api/v1/login', credentials, config)
                .then(function (response) {
                    if(response.headers('access-token') && response.headers('expires')) {
                        token.token_id = response.headers('access-token');
                        token.expiry = response.headers('expires');
                        console.log(response.body);
                        userService.initUser(credentials.username, token);
                        $rootScope.authenticated = true;
                        $location.path('/home');
                    } else {
                        $rootScope.authenticated = false;
                        $location.path('/');
                    }
                }, function () {
                    $rootScope.authenticated = false;
                    $location.path('/');
                });
        },

        register: function (credentials) {
            console.log("register with credentials", credentials);

            $http.post('/api/v1/register', credentials, config)
                .then(function (response) {
                    if(response.headers('access-token') && response.headers('expires')) {
                        token.token_id = response.headers('access-token');
                        token.expiry = response.headers('expires');
                        userService.initUser(credentials.username, token);
                        $rootScope.authenticated = true;
                        $location.path('/');
                    } else {
                        $rootScope.authenticated = false;
                        $location.path('/');
                    }
                }, function () {
                    $rootScope.authenticated = false;
                    $location.path('/signup');
                });
        },


        logout: function (credentials) {
            console.log("logout with credentials", credentials);

            $http.post('/api/v1/logout', credentials, config);
        },
    }
}]);