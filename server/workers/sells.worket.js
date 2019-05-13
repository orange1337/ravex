/*
	Sells Worker for aggregating history of orders on marketplace, created by orange1337
*/
const { SETTINGS_DB, 
		SELLS_FT_DB, 
		ASSETS_FT_DB, 
		log, 
		config, 
		eos,
		wrapper
	  } = require('./header')('sells_daemon');

const timeout   		= config.daemons.timeout; // 1 sec
const elemLimitSells  	= config.daemons.limitSells;
const elemLimitAssets 	= config.daemons.limitAssets;

async function generateSellsFT(fromId){
	  let sellsTableFT = await wrapper.toStrong(eos.getTableRows({
	  			json: true,
			    code: config.market,
			    scope: config.market,
			    table: 'sellsf',
			    table_key: 'string',
			    lower_bound: fromId,
			    upper_bound: '-1',
			    limit: elemLimitSells
	  }));

	  if (!sellsTableFT || !sellsTableFT.rows || !sellsTableFT.rows.length){
	  		console.log(`==== SellsFT cursor: `, fromId);
	  		return wrapper.pause(generateSellsFT, timeout, 0);
	  }

	  for (let elem of sellsTableFT.rows){
	  	elem.sellid     = elem.id;
	  	let quantity 	= elem.quantity.split(" ");
	  	elem.qtyNum 	= Number(quantity[0]);
	  	elem.symbol 	= quantity[1];
	  	elem.priceNum   = Number(elem.price.split(" ")[0]);
	  	elem.active     = true;
	  	await wrapper.toLite(SELLS_FT_DB.updateOne({ sellid: elem.sellid }, elem, { upsert: true }));
	  }
	  let lastAssetId = Number(sellsTableFT.rows[sellsTableFT.rows.length - 1].sellid);
	  wrapper.pause(generateSellsFT, 0, (lastAssetId) ? lastAssetId + 1 : 0);
}

/**
 * Start workers
 */
generateSellsFT(0);
