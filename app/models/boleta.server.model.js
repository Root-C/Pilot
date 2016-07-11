'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var BoletaSchema = new Schema({
  idboleta: {
    type: Number
  },
  fecha_trans: {
    type: Date,
    default:Date.now
  },
  monto_total: {
    type:Number,
    default:0
  },
  monto_descontado: {
    type:Number,
    default:0
  },
  monto_facturado: {
    type:Number,
    default:0
  },
  monto_pagado: {
    type:Number,
    default:0
  },
  idusuario: {
    type:String
  },
  idcliente: {
    type: Schema.ObjectId,
    ref: 'Cliente'
  },
  status: {
    type: Number
  },
  updated_at: {
    type: Date,
    default:Date.now
  }
});

mongoose.model('Boleta', BoletaSchema);
