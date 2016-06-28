// Invocar modo JavaScript 'strict'
'use strict';

// Configurar el módulo routes de 'clientes'
angular.module('clientes').config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
		when('/clientes', {
			templateUrl: 'clientes/views/list-clientes.client.view.html'
		}).
		when('/clientes/create', {
			templateUrl: 'clientes/views/create-cliente.client.view.html'

		}).
		when('/clientes/:clienteId', {
			templateUrl: 'clientes/views/view-cliente.client.view.html'
		}).
		when('/clientes/:clienteId/edit', {
			templateUrl: 'clientes/views/edit-cliente.client.view.html'
		}).
		when('/hola', {
			templateUrl: 'clientes/views/search-cliente.client.view.html'
		});
	}
]); 