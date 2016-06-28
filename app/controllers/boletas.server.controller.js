// Invocar modo JavaScript 'strict' 
'use strict';

// Cargar las dependencias del módulo
var mongoose = require('mongoose'),
	Boleta = mongoose.model('Boleta');

// Crear un nuevo método controller para el manejo de errores
var getErrorMessage = function(err) {
	if (err.errors) {
		for (var errName in err.errors) {
			if (err.errors[errName].message) return err.errors[errName].message;
		}
	} else {
		return 'Error de servidor desconocido';
	}
};


// Crear un nuevo método controller para crear nuevos artículos
exports.create = function(req, res) {
	// Crear un nuevo objeto artículo
	var boleta = new Boleta(req.body);

	// Configurar la propiedad 'creador' del artículo
	boleta.idcliente = req.cliente;

	// Intentar salvar el artículo
	boleta.save(function(err) {
		if (err) {
			// Si ocurre algún error enviar el mensaje de error
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Enviar una representación JSON del artículo 
			res.json(boleta);
		}
	});
};



// Crear un nuevo método controller que recupera una lista de artículos
exports.list = function(req, res) {
	// Usar el método model 'find' para obtener una lista de artículos
	Boleta.find().sort('-idboleta').populate('idcliente', 'nombre_cliente').exec(function(err, boletas) {
		if (err) {
			// Si un error ocurre enviar un mensaje de error
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Enviar una representación JSON del artículo 
			res.json(boletas);
		}
	});
};


// Crear un nuevo controller middleware que recupera un único artículo existente PARAMETRIZA A LOS DEMAS
exports.boletaByID = function(req, res, next, id) {
	// Usar el método model 'findById' para encontrar un único artículo 
	Boleta.findById(id).populate('idcliente', 'nombre_cliente').exec(function(err, boletas) {
		if (err) return next(err);
		if (!boleta) return next(new Error('Fallo al cargar el artículo ' + id));

		// Si un artículo es encontrado usar el objeto 'request' para pasarlo al siguietne middleware
		req.boleta = boletas;

		// Llamar al siguiente middleware
		next();
	});
};



// Crear un nuevo método controller que devuelve un artículo existente
exports.read = function(req, res) {
	res.json(req.boleta);
};

// Crear un nuevo método controller que actualiza un artículo existente
exports.update = function(req, res) {
	// Obtener el artículo usando el objeto 'request'
	var boleta = req.boleta;

	// Actualizar los campos artículo

	boleta.monto_total = req.body.monto_total;
	boleta.monto_descontado = req.body.monto_descontado;
	boleta.monto_facturado = req.body.monto_facturado;
	boleta.monto_pagado= req.body.monto_pagado;


	// Intentar salvar el artículo actualizado
	boleta.save(function(err) {
		if (err) {
			// si ocurre un error enviar el mensaje de error
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Enviar una representación JSON del artículo 
			res.json(boleta);
		}
	});
};



// Crear un nuevo método controller que borre un artículo existente
exports.delete = function(req, res) {
	// Obtener el artículo usando el objeto 'request'
	var boleta = req.boleta;

	// Usar el método model 'remove' para borrar el artículo
	boleta.remove(function(err) {
		if (err) {
			// Si ocurre un error enviar el mensaje de error
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Enviar una representación JSON del artículo 
			res.json(boleta);
		}
	});
};


