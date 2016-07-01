// Invocar modo JavaScript 'strict'
'use strict';

// Crear el service 'detalles'
angular.module('detalles').factory('Detalles', ['$resource', function($resource) {
	// Usar el service '$resource' para devolver un objeto '$resource' detalle



return {
	  //Resource de parametros por id
      // ID: $resource('api/detalles/:detalleId', 
      // {
      // 	detalleId: '@_id'
      // }, 
      // {
      // 	update: {method: 'PUT'}
      // }),
      ID: $resource('api/detalles/:detalleId', 
      {
        detalleId: '@_id'
      }, 
      {
       'get': { method: 'GET', isArray: false }
      }),



      //Resource de parametros por apellido
      ForNum: $resource('api/detalle/:idboleta', 
      {
      	idboleta: '@idboleta'
      }, 
      {
        'get': { method: 'GET', isArray: true }
      })

    };

  


}]);
