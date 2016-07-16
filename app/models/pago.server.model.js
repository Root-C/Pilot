'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PagoSchema = new Schema({
  idboleta: {
    type: Number
  },
  idproducto: {
    type: String
  },
  descripcionproducto: {
    type:String
  },
  precioproducto: {
    type:Number
  },
  cantidadproducto: {
    type:Number,
    default:1
  },
  preciofacturado: {
    type:Number
  },
  monto_pagado: {
    type:Number,
    default:0
  },
  monto_cancelado: {
    type:Number,
    default:0
  },
  fecha_trans: {
    type: Date,
    default:Date.now
  },
  ref_preciofacturado: {
    type:Number
  },
  ref_idproducto: {
    type:String
  },
  ref_descripcionproducto:{
    type:String
  },
  nombre_cliente:{
    type:String
  },

  iddetalle: {
    type: Schema.ObjectId,
    ref: 'Detalle'
  }
});
mongoose.model('Pago', PagoSchema);

