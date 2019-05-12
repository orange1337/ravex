/*
	Init DB, created by orange1337
*/
const configName    = (process.env.CONFIG_NAME) ? process.env.CONFIG_NAME : 'config';
const config        = require(`../${configName}`);

const mongoose      = require("mongoose");
mongoose.Promise  	= global.Promise;

const connect = () => {
	const mongoMain = mongoose.createConnection(config.MONGO_URI, config.MONGO_OPTIONS,
	 (err) => {
	    if (err){
	      console.error(err);
	      process.exit(1);
	    }
	    console.log(`[Connected to Mongo]`);
	});

	const SETTINGS_DB  		= require('./schemas/global.model')(mongoMain);
	const ORDERS_DB    		= require('./schemas/orders.model')(mongoMain);

	/**
	 * Fungible Tokens Tables
	 */
	const SELLS_FT_DB   = require('./schemas/ft.sells.model')(mongoMain);
	const ASSETS_FT_DB  = require('./schemas/ft.assets.model')(mongoMain);
	const CLAIMS_FT_DB  = require('./schemas/ft.claims.model')(mongoMain);

	return { 
		SETTINGS_DB, 
		ORDERS_DB, 
		SELLS_FT_DB,
		ASSETS_FT_DB,
		CLAIMS_FT_DB
	};
};

module.exports = { connect };