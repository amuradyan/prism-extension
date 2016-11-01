'use strict';
mainModule.factory('prdRequestService', ['$resource','$log', function ($resource,$log) {

    var baseUrl = 'http://localhost:8081/api/v1/';


    var config = {
        headers: {
            'Content-Type': 'application/json',
            'Custom-Header': 'custom/Value'
        }
    };

    var prdHeaders = {
        'Content-Type': 'application/json',
        'Custom-Header': 'custom/Value'
    };

    return {
        get: function (url, params) {
            $log.debug(baseUrl + url);
            return $resource(baseUrl + url, {}, {
                get: {
                    method: 'GET',
                    isArray: false,
                    headers: prdHeaders
                }
            }).get(params).$promise;
        },
        getArray: function (url, params) {
            $log.debug(baseUrl + url);
            return $resource(baseUrl + url, {}, {
                get: {
                    method: 'GET',
                    isArray: true,
                    headers: prdHeaders
                }
            }).get(params).$promise;
        },
        post: function (url, postBody) {
            $log.debug(baseUrl + url);
            return $resource(baseUrl + url, {}, {
                post: {
                    method: 'POST',
                    isArray: false,
                    headers: prdHeaders
                }
            }).post(postBody).$promise;
        },
        put: function (url, putBody) {
            $log.debug(baseUrl + url);
            return $resource(baseUrl + url, {}, {
                post: {
                    method: 'PUT',
                    isArray: false,
                    headers: prdHeaders
                }
            }).put(putBody).$promise;
        },
        delete: function (url, deleteParams) {
            $log.debug(baseUrl + url);
            return $resource(baseUrl + url, {}, {
                post: {
                    method: 'DELETE',
                    isArray: false,
                    headers: prdHeaders
                }
            }).delete(deleteParams).$promise;
        }
    }
}]);
