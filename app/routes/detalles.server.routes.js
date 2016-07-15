// Invocar modo JavaScript 'strict'
'use strict';

// Cargar las dependencias del módulo
var detalles = require('../../app/controllers/detalles.server.controller');

// Definir el método routes de module
module.exports = function(app) {
	// Configurar la rutas base a 'detalles'  
	app.route('/api/detalles')
	   .get(detalles.list)
	   .post(detalles.create);
	
	// Configurar las rutas 'detalles' parametrizadas
	app.route('/api/detalles/:detalleId')
	   .get(detalles.read)
	   .put(detalles.update)
	   .delete(detalles.delete);

	app.route('/api/detalle/:idboleta')
	 	.get(detalles.listdetallesxboleta);

	 
	 app.route('/api/detallestop10')
	.get(detalles.listTopTen);
	// Configurar el parámetro middleware 'detalleId'   
	app.param('detalleId', detalles.detalleByID);
	app.param('idboleta', detalles.detallesForNum);
};

