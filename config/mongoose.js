// Invocar el modo 'strict' de JavaScript
'use strict';

// Carga las dependencias del módulo
var	config = require('./config'),
	mongoose = require('mongoose');

// Definir el método de configuración de Mongoose
module.exports = function() {
	// Usar Mongoose para conectar a MongoDB
	var db = mongoose.connect(config.db);

	//Cargar el modelo distritos
	require('../app/models/distrito.server.model');

	// Cargar el modelo 'User' 
	require('../app/models/user.server.model');

    // Cargar el modelo 'Article'
	require('../app/models/article.server.model');

 	// Cargar el modelo 'Cliente'
	require('../app/models/cliente.server.model');

	//Cargar el modelo Boletas
	require('../app/models/boleta.server.model');

	//Cargar el modelo Detalles
	require('../app/models/detalle.server.model');

	//Cargar el modelo Pagos
	require('../app/models/pago.server.model');



	// Devolver la instancia de conexión a Mongoose
	return db;
};