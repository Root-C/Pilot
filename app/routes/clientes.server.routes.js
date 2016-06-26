// Invocar modo JavaScript 'strict'
'use strict';

// Cargar las dependencias del módulo
var users = require('../../app/controllers/users.server.controller'),
	clientes = require('../../app/controllers/clientes.server.controller');

// Definir el método routes de module
module.exports = function(app) {
	// Configurar la rutas base a 'clientes'  
	app.route('/api/clientes')
	   .get(clientes.list)
	   .post(users.requiresLogin, clientes.create);
	
	// Configurar las rutas 'clientes' parametrizadas
	app.route('/api/clientes/:articleId')
	   .get(clientes.read)
	   .put(users.requiresLogin, clientes.hasAuthorization, clientes.update)
	   .delete(users.requiresLogin, clientes.hasAuthorization, clientes.delete);

	// Configurar el parámetro middleware 'articleId'   
	app.param('clienteId', clientes.clienteByID);
};

