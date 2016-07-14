// Invocar modo JavaScript 'strict'
'use strict';

// Cargar las dependencias del módulo
var pagos = require('../../app/controllers/pagos.server.controller');

// Definir el método routes de module
module.exports = function(app) {
	// Configurar la rutas base a 'pagos'  
	app.route('/api/pagos')
	   .post(pagos.create);


	app.route('/api/fecha/:start/:end')
		.get(pagos.fecha);
	app.route('/api/max/:start/:end')
		.get(pagos.max);

	// Configurar el parámetro middleware 'detalleId'   
	app.param(['start', 'end'],pagos.paymentByDates); 
		app.param(['start', 'end'],pagos.paymentByMax); 

};
