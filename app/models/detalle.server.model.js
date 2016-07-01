'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var DetalleSchema = new Schema({
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
  descuentoproducto: {
    type:Number,
    default:0
  },
  preciofinal: {
    type:Number
  }
});

mongoose.model('Detalle', DetalleSchema);


