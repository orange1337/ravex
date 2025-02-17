/*
   Created by orange1337
*/
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var MODEL_NAME = 'GLOBAL';
var TABLE_NAME = 'GLOBAL';
var MODEL;

var API = new mongoose.Schema({
  cursor_history: {
    type: Number,
    default: 0 
  },
  cursor_history_time: {
    type: Date
  },
  cursor_assets: {
    type: Number,
    default: 0 
  },
  cursor_assets_time: {
    type: Date
  }
});


module.exports = function (connection) {
  if ( !MODEL ) {
    if ( !connection ) {
      connection = mongoose;
    }
    MODEL = connection.model(MODEL_NAME, API, TABLE_NAME);
  }
  return MODEL;
};



