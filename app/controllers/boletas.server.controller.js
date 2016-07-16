// Invocar modo JavaScript 'strict' 
'use strict';

// Cargar las dependencias del módulo
var mongoose = require('mongoose'),
	Boleta = mongoose.model('Boleta'),
	Cliente= mongoose.model('Cliente');


var boletascant=0;

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
	Boleta.find().count(function(err, count) {
	boletascant= count+1;
  	
	
	// Crear un nuevo objeto artículo
	var boleta = new Boleta(req.body);

	// Configurar la propiedad 'creador' del artículo
	boleta.idboleta= boletascant;
	boleta.idusuario="Admin";
	boleta.status=0;


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
	});
};




// Crear un nuevo método controller que recupera una lista de artículos
exports.list = function(req, res) {
	// Usar el método model 'find' para obtener una lista de artículos
	Boleta.find({status: 1}).sort('-idboleta').populate('idcliente', 'nombre_cliente ape_pat_cliente ape_mat_cliente').exec(function(err, boletas) {
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


exports.listTopTen = function(req, res) {
	// Usar el método model 'find' para obtener una lista de artículos 
	Boleta.find({status: 1}).sort('-idboleta').limit(10).populate('idcliente', 'nombre_cliente ape_pat_cliente ape_mat_cliente').exec(function(err, boletas) {
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


exports.listTopTenSortDate = function(req, res) {
	// Usar el método model 'find' para obtener una lista de artículos 
	Boleta.find({status: 1}).sort('-updated_at').limit(10).populate('idcliente', 'nombre_cliente ape_pat_cliente ape_mat_cliente').exec(function(err, boletas) {
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
	Boleta.findById(id).populate('idcliente', 'nombre_cliente ape_pat_cliente ape_mat_cliente').exec(function(err, boletas) {
		if (err) return next(err);
		if (!boletas) return next(new Error('Fallo al cargar la boleta ' + id));

		// Si un artículo es encontrado usar el objeto 'request' para pasarlo al siguietne middleware
		req.boleta = boletas;

		// Llamar al siguiente middleware
		next();
	});
};

exports.boletaByClientID = function(req,res,next,id){
	
	Boleta.find({'idcliente' : id,status: 1}).sort('-idboleta').populate('idcliente', 'nombre_cliente ape_pat_cliente ape_mat_cliente').exec(function(err, boletas) {
		if (err) return next(err);
		if (!boletas) return next(new Error('Fallo al cargar la boleta ' + id));

		// Si un artículo es encontrado usar el objeto 'request' para pasarlo al siguietne middleware
		req.boletabyclient = boletas;

		// Llamar al siguiente middleware
		next();
	});

};



//Por fecha Quedaa
exports.boletaByDates = function(req,res,next){
var start=req.params.start;
var end=req.params.end;
	Boleta.find(
		{"fecha_trans": {"$gte": new Date(start), "$lt": new Date(end)}})
		//{"fecha_trans": {"$gte": new Date(start)}})
		.populate('idcliente', 'nombre_cliente ape_pat_cliente ape_mat_cliente').exec(function(err, boletas) {
		if (err) return next(err);
		if (!boletas) return next(new Error('Fallo al cargar la boleta ' + id));

		// Si un artículo es encontrado usar el objeto 'request' para pasarlo al siguietne middleware
		req.boletabydate = boletas;

		// Llamar al siguiente middleware
		next();
	});

};


exports.boletasForNum = function(req, res, next, idboleta) {
	var idboleta = req.params.idboleta;
	// Usar el método model para encontrar un único detalle 
		Boleta.find({'idboleta' : (idboleta)},function(err, boletas) {
		if(err){
			
			console.log(err);
		}
		req.boletasxn = boletas;

		// Llamar al siguiente middleware
		next();

        }).populate('idcliente', 'nombre_cliente ape_pat_cliente ape_mat_cliente');
		
	};


exports.boletasnum = function(req, res) {
	res.json(req.boletasxn);
};


//db.boletas.find({fecha_trans: {"$gte": new Date("2016-07-09T14:23:04.799Z"),"$lt": new Date("2016-07-10T14:23:04.799Z")}})




exports.boletaByDate = function(req, res) {
	res.json(req.boletabydate);
};




exports.boletaByClient = function(req, res) {
	res.json(req.boletabyclient);
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
	if(req.body.monto_total){
	boleta.monto_total = req.body.monto_total;
	}
	

	if(req.body.monto_descontado){
	boleta.monto_descontado = req.body.monto_descontado;
	}
	

	if(req.body.monto_facturado){
	boleta.monto_facturado = req.body.monto_facturado;
	}
	

	if(req.body.monto_pagado){
	boleta.monto_pagado= (parseFloat(boleta.monto_pagado) + parseFloat(req.body.monto_pagado));
	}

	if(req.body.status){
	boleta.status=req.body.status;
	}


	if(req.body.updated_at){
	boleta.updated_at=req.body.updated_at;
	}
	
	if(req.body.status){
	boleta.status=req.body.status;
	}
	


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

