// Invocar modo JavaScript 'strict'
'use strict';

// Crear el service 'clientes'
angular.module('clientes').factory('Clientes', ['$resource', function($resource) {
	// Usar el service '$resource' para devolver un objeto '$resource' cliente



return {
	  //Resource de parametros por id
      // ID: $resource('api/clientes/:clienteId', 
      // {
      // 	clienteId: '@_id'
      // }, 
      // {
      // 	update: {method: 'PUT'}
      // }),
      ID: $resource('api/clientes/:clienteId', 
      {
        clienteId: '@_id'
      }, 
      {
       'get': { method: 'GET', isArray: false }
      }),


      //Resource de parametros por apellido
      Apellido: $resource('api/cliente/:apellido', 
      {
      	apellido: '@ape_pat_cliente'
      }, 
      {
        'get': { method: 'GET', isArray: true }
      })

    };

  


}]);
