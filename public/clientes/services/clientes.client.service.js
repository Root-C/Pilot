// Invocar modo JavaScript 'strict'
'use strict';

// Crear el service 'clientes'
angular.module('clientes').factory('Clientes', ['$resource', function($resource) {
	// Usar el service '$resource' para devolver un objeto '$resource' cliente
    return $resource('api/clientes/:clienteId', {
        articleId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);