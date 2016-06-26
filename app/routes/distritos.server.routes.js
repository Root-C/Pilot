// Invocar modo JavaScript 'strict'
'use strict';

// Cargar las dependencias del módulo
var distritos = require('../../app/controllers/distritos.server.controller');

// Definir el método routes de module
// Definir el método routes de module
module.exports = function(app) {
	// Configurar la rutas base a 'articles'  
	app.route('/api/distritos')
	   .get(distritos.list);
	
	// Configurar las rutas 'articles' parametrizadas

};
