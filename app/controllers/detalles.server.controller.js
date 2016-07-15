// Invocar modo JavaScript 'strict' 
'use strict';

// Cargar las dependencias del módulo
var mongoose = require('mongoose'),
	Detalle = mongoose.model('Detalle');

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
	var detalle = new Detalle(req.body);


	// Intentar salvar el artículo
	detalle.save(function(err) {
		if (err) {
			// Si ocurre algún error enviar el mensaje de error
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Enviar una representación JSON del artículo 
			res.json(detalle);
		}
	});
};

// Crear un nuevo método controller que recupera una lista de artículos
exports.list = function(req, res) {
	// Usar el método model 'find' para obtener una lista de artículos
	Detalle.find().sort('-idboleta').exec(function(err, detalles) {
		if (err) {
			// Si un error ocurre enviar un mensaje de error
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Enviar una representación JSON del artículo 
			res.json(detalles);
		}
	});
};

exports.listTopTen = function(req, res) {
	// Usar el método model 'find' para obtener una lista de artículos
	Detalle.find().sort('-idboleta').limit(10).exec(function(err, detalles) {
		if (err) {
			// Si un error ocurre enviar un mensaje de error
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Enviar una representación JSON del artículo 
			res.json(detalles);
		}
	});
};

// Crear un nuevo controller middleware que recupera un único artículo existente PARAMETRIZA A LOS DEMAS
exports.detalleByID = function(req, res, next, id) {
	// Usar el método model 'findById' para encontrar un único artículo 
	Detalle.findById(id).exec(function(err, detalle) {
		if (err) return next(err);
		if (!detalle) return next(new Error('Fallo al cargar el artículo ' + id));

		// Si un artículo es encontrado usar el objeto 'request' para pasarlo al siguietne middleware
		req.detalle = detalle;

		// Llamar al siguiente middleware
		next();
	});
};



// Crear un nuevo método controller que devuelve un artículo existente
exports.read = function(req, res) {
	res.json(req.detalle);
};




// Crear un nuevo método controller que actualiza un artículo existente
exports.update = function(req, res) {
	// Obtener el artículo usando el objeto 'request'
	var detalle = req.detalle;

	// Actualizar los campos artículo
	detalle.payperitem = (parseFloat(detalle.payperitem) + parseFloat(req.body.payperitem));

	// Intentar salvar el artículo actualizado
	detalle.save(function(err) {
		if (err) {
			// si ocurre un error enviar el mensaje de error
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Enviar una representación JSON del artículo 
			res.json(detalle);




		}
	});
};



// Crear un nuevo método controller que borre un artículo existente
exports.delete = function(req, res) {
	// Obtener el artículo usando el objeto 'request'
	var detalle = req.detalle;
	var boleta= req.detalle.idboleta;

	// Usar el método model 'remove' para borrar el artículo
	detalle.remove(function(err) {
		if (err) {
			// Si ocurre un error enviar el mensaje de error
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Enviar una representación JSON del artículo 
			//res.json(detalle);

			// Usar el método model 'find' para obtener una lista de artículos
	

	Detalle.find({idboleta:boleta},function(err, detalles) {		
        res.status(200).send(detalles);
		});


		}
	});
};


//Buscar Cliente por apellido
exports.detallesForNum = function(req, res, next, idboleta) {
	var idboleta = req.params.idboleta;
	// Usar el método model para encontrar un único detalle 
		Detalle.find({'idboleta' : (idboleta)},function(err, detalles) {
		if(err){
			
			console.log(err);
		}
		req.idboleta= 1;
		req.detalle = detalles;

		// Llamar al siguiente middleware
		next();

        });
		
	};



// Crear un nuevo método controller que devuelve un detalle existente
exports.listdetallesxboleta = function(req, res) {
	res.json(req.detalle);
};