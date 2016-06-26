// Invocar modo JavaScript 'strict'
'use strict';

// Crear el service 'articles'
angular.module('distritos').factory('Distritos', ['$resource', function($resource) {
	// Usar el service '$resource' para devolver un objeto '$resource' article
    return $resource('api/distritos');

}]);