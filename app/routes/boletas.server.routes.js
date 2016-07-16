// Invocar modo JavaScript 'strict'
'use strict';

// Cargar las dependencias del módulo
var boletas = require('../../app/controllers/boletas.server.controller');

// Definir el método routes de module
module.exports = function(app) {
	// Configurar la rutas base a 'boletas'  
	app.route('/api/boletas')
	   .get(boletas.list)
	   .post(boletas.create);
	
	// Configurar las rutas 'boletas' parametrizadas
	app.route('/api/boletas/:boletaId')
	   .get(boletas.read)
	   .put(boletas.update)
	   .delete(boletas.delete);

	app.route('/api/boletastop10')
	.get(boletas.listTopTen);

	app.route('/api/toptendate')
	.get(boletas.listTopTenSortDate);

	app.route('/api/boleta/:ClienteID')
	   .get(boletas.boletaByClient);

	app.route('/api/boletasxnum/:idboleta')
		.get(boletas.boletasnum);

	//app.route('/api/fecha/:start/:end')
	//	.get(boletas.boletaByDate);

	// Configurar el parámetro middleware 'articleId'  
	app.param('boletaId', boletas.boletaByID);
	app.param('ClienteID', boletas.boletaByClientID);
	app.param('idboleta',boletas.boletasForNum);
	//app.param(['start', 'end'],boletas.boletaByDates); 
	//app.param('end',boletas.boletaByDates); 


};

