'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ClienteSchema = new Schema({
  nombre_cliente: {
    type: String
  },
  ape_pat_cliente: {
    type: String
  },
  ape_mat_cliente: {
    type: String
  },
  fecha_nac_cliente: {
    type: Date
  },
  dni_cliente: {
    type: String
  },
  direccion_cliente: {
    type: String
  },
  celular_cliente: {
    type: String
  },
  fijo_cliente: {
    type: String
  },
  distrito: {
    type: Schema.ObjectId,
    ref: 'Distrito'
  }
});

mongoose.model('Cliente', ClienteSchema);
