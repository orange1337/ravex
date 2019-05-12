/*
   Created by orange1337
*/
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var MODEL_NAME = 'FT_SELLS';
var TABLE_NAME = 'FT_SELLS';
var MODEL;

// Model without any fixed schema
var FT_SELLS = new mongoose.Schema({}, {strict: false});

module.exports = function (connection) {
  if ( !MODEL ) {
    if ( !connection ) {
      connection = mongoose;
    }
    MODEL = connection.model(MODEL_NAME, FT_SELLS, TABLE_NAME);
  }
  return MODEL;
};



