// Invocar modo JavaScript 'strict'
'use strict';

// Crear el service 'articles'
angular.module('boletas').factory('Boletas', ['$resource', function($resource) {
	// Usar el service '$resource' para devolver un objeto '$resource' article
    return $resource('api/boletas/:boletaId', {
        boletaId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });

	

}]);