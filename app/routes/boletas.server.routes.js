// Invocar modo JavaScript 'strict'
'use strict';

// Cargar las dependencias del módulo
var clientes = require('../../app/controllers/clientes.server.controller'),
	boletas = require('../../app/controllers/boletas.server.controller');

// Definir el método routes de module
module.exports = function(app) {
	// Configurar la rutas base a 'boletas'  
	app.route('/api/boletas')
	   .get(boletas.list)
	   .post(clientes.clienteByID, boletas.create);
	
	// Configurar las rutas 'boletas' parametrizadas
	app.route('/api/boletas/:boletaId')
	   .get(boletas.read)
	   .put(boletas.update)
	   .delete(boletas.delete);

	// Configurar el parámetro middleware 'articleId'   
	app.param('boletaId', boletas.boletaByID);
};

