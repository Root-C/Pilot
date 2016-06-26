'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var DistritoSchema = new Schema({
  distrito: {
    type: String
  }
});

mongoose.model('Distrito', DistritoSchema);
