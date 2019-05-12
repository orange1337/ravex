/*
   Created by orange1337
*/
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var MODEL_NAME = 'FT_ASSETS';
var TABLE_NAME = 'FT_ASSETS';
var MODEL;

// Model without any fixed schema
var FT_ASSETS = new mongoose.Schema({}, {strict: false});

module.exports = function (connection) {
  if ( !MODEL ) {
    if ( !connection ) {
      connection = mongoose;
    }
    MODEL = connection.model(MODEL_NAME, FT_ASSETS, TABLE_NAME);
  }
  return MODEL;
};