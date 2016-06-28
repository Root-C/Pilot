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
	app.route('/api/clientes/:clienteId')
	   .get(clientes.read)
	   .put(users.requiresLogin, clientes.hasAuthorization, clientes.update)
	   .delete(users.requiresLogin, clientes.hasAuthorization, clientes.delete);

	 app.route('/api/cliente/:apellido')
	 	.get(clientes.listapellido);


	// Configurar el parámetro middleware 'clienteId'   
	app.param('clienteId', clientes.clienteByID);
	app.param('apellido', clientes.clienteByLastName);
};

