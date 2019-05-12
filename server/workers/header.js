/*
	Header require for daemons, created by orange1337
*/
const request		= require('request-promise');
const path 			= require("path");
const fs 			= require("fs");
const md5 			= require('md5');

const configName    = (process.env.CONFIG_NAME) ? process.env.CONFIG_NAME : 'config';
const config        = require(`../${configName}`);

const EOS     		= require('eosjs');
const eos     		= EOS(config.eosConfig);

module.exports = (loggerFileName) => {
	
	const customSlack = require('../modules/slack.module');
	const logSlack    = customSlack.configure(config.loggerSlack.alerts);

	process.on('uncaughtException', (err) => {
    	logSlack(`======= UncaughtException ${loggerFileName} saemon : ${err}`);
	});
	process.on('unhandledRejection', (reason, p) => {
	    log.error(`Unhandled Rejection at: reason: ${reason}`, p);
	});

	const { 
		SETTINGS_DB, 
		ORDERS_DB, 
		SELLS_FT_DB,
		ASSETS_FT_DB,
		CLAIMS_FT_DB
	} = require('../db/init.db').connect(log);

	const { asyncWrapper, asyncForEach } = require('../utils/main.utils');
	const wrapper = new asyncWrapper(log);

	function sendSocketUpdate(act, uri){
		let options = {
			uri: `${config.host}/api/v1/socket/${uri}/${config.socketToken}`,
			method: 'POST',
			json: true,
		  	body: { act }
		};
		// send socket request without waiting for promise
		request(options);
	}

	return {  
			  SETTINGS_DB, 
		      ORDERS_DB, 
		      SELLS_FT_DB,
		      ASSETS_FT_DB,
		      CLAIMS_FT_DB,
		      eos, 
		      log, 
		      logSlack, 
		      config, 
		      request, 
		      path, 
		      fs,
		      md5,
		      sendSocketUpdate,
		      wrapper,
		      asyncForEach
		   };
};