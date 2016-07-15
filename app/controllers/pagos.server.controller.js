// Invocar modo JavaScript 'strict' 
'use strict';

// Cargar las dependencias del módulo
var mongoose = require('mongoose'),
	Pago = mongoose.model('Pago');

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
	var pago = new Pago(req.body);


	// Intentar salvar el artículo
	pago.save(function(err) {
		if (err) {
			// Si ocurre algún error enviar el mensaje de error
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Enviar una representación JSON del artículo 
			res.json(pago);
		}
	});
};


exports.paymentByDates = function(req,res,next){
var start=req.params.start;
var end=req.params.end;
	Pago.find(
		{"fecha_trans": {"$gte": new Date(start), "$lt": new Date(end)}}).exec(function(err, pagos) {
		if (err) return next(err);
		if (!pagos) return next(new Error('Fallo al cargar la boleta ' + id));

		// Si un artículo es encontrado usar el objeto 'request' para pasarlo al siguietne middleware
		req.paymentbydate = pagos;

		// Llamar al siguiente middleware
		next();
	});

};

exports.paymentByMax = function(req,res,next){
var start=req.params.start;
var end=req.params.end;
	Pago.aggregate([
        { $match: { "fecha_trans": { "$gte": new Date(start), "$lt": new Date(end) } } },
        { $group: { 
        	
        	_id: "$iddetalle", 
        	fecha_trans : { $max: '$fecha_trans' },

        	//Artificio de Alias, nombre verdadero idproducto
        	ref_idproducto :  { $first: '$idproducto' },

        	//Artificio de Alias, nombre verdadero descripcionproducto
        	ref_descripcionproducto : { $first: '$descripcionproducto' },
        	cantidadproducto : { $first: '$cantidadproducto' },
        	monto_cancelado : { $first: '$monto_cancelado' },

        	//Artificio de Alias, nombre verdadero prefiofacturado
        	ref_preciofacturado : { $first: '$preciofacturado' },

        	//Artificio de Alias, nombre verdadero monto_pagado
        	monto_cancelado: { $max: "$monto_pagado" } } }])

	.exec(function(err, pagos) {
		if (err) return next(err);
		if (!pagos) return next(new Error('Fallo al cargar '));

		// Si un artículo es encontrado usar el ojeto 'request' para pasarlo al siguietne middleware
		req.paymentbydatemax = pagos;

		// Llamar al siguiente middleware
		next();
	});

};

   

//db.tabla1.aggregate({ $group: { _id: { nombre: "$nombre"},'montomaximo': { $max : "$monto" }}})



// Crear un nuevo método controller que devuelve un artículo existente
exports.fecha = function(req, res) {
	res.json(req.paymentbydate);
};

exports.max = function(req, res) {
	res.json(req.paymentbydatemax);
};

