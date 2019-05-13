/*
	History aggregation Worker, created by orange1337  
*/
const { CLAIMS_FT_DB, 
		SETTINGS_DB, 
		ORDERS_DB, 
		ASSETS_FT_DB,
		eos, 
		log, 
		config, 
		request, 
		md5,
		sendSocketUpdate,
		wrapper,
		asyncForEach
	  } = require('./header')('assets_daemon');

const elemLimitAssets = config.daemons.limitAssets;
const timeout  = config.daemons.timeoutHistory;

/**
 * [aggregateHistoryAssets - Aggregate history from Assets contract]
 */

async function aggregateHistoryAssets(){
	let settings = await wrapper.toStrong(SETTINGS_DB.findOne({}));
	if (!settings){
		return setTimeout(aggregateHistoryAssets, timeout);
	}
	await getAssetsActions(settings);
	
	await wrapper.toStrong(settings.save());
	console.log('===== END assets aggregation', settings);
	setTimeout(aggregateHistoryAssets, timeout);
}
	
async function getAssetsActions(settings){
	let limit = 1000;
	let after  = settings.cursor_assets_time;
	let skip  = settings.cursor_assets;
	console.log('===== assets skip =====', skip);

	let query = (skip === 0) ? `skip=0` : `after=${after.toISOString()}`;
	let options = {
		uri: `${config.historyChainV2}/v2/history/get_actions?sort=1&account=${config.assets}&limit=${limit}&${query}`,
		method: 'GET',
		json: true
	};
	let [err, data] = await wrapper.to(request(options));
	if (err){
		log.error(err);
		return;
	}
	if (data.actions.length === 0 || data.actions.length === 1) return;
	await saveAssetsActions(data);
	console.log('actions = ', data.actions.length, data.actions[data.actions.length - 1]['@timestamp']);
	settings.cursor_assets += data.actions.length;
	settings.cursor_assets_time = data.actions[data.actions.length - 1]['@timestamp'];
	getAssetsActions(settings);
}
	
async function saveAssetsActions(data){
	for (let elem of data.actions){
		if (elem._id){
			delete elem._id;
		}
		let act = elem.act;
		if (act.name === 'issuef') {
			let symbol = act.data.quantity.split(" ")[1];
			await saveAssetFT(act.data.author, symbol);
		}
		if (act.name === 'updatef') {
			let symbol = act.data.sym.split(",")[1];
			await saveAssetFT(act.data.author, symbol);
		}
		if (act.name === 'offerf' && act.data.owner !== config.market){
			sendSocketUpdate(act, 'ft/wallet');
		}
		if (act.name === 'claimf' || act.name === 'cancelofferf') {
			sendSocketUpdate(act, 'ft/wallet');
			await wrapper.toLite(CLAIMS_FT_DB.updateMany({ claimid: { $in: act.data.ftofferids } }, { active: false }));
		}
	}
}

async function saveAssetFT(author, symbol){
	let [err, item] = await wrapper.to(eos.getTableRows({
	 	json: true,
    	code:  config.assets,
    	scope: author,
    	table: 'stat',
    	table_key: 'id',
    	lower_bound: `${symbol}`,
    	upper_bound: `${symbol}ZZZZZZZ`,
    	limit: elemLimitAssets
	}));
	if (err){
	 	log.error(err);
	}
	if (item && item.rows && item.rows[0]){
	 	let objUpdate = {
	 			supply: item.rows[0].supply,
	 			max_supply: item.rows[0].max_supply,
	 			issuer: item.rows[0].issuer,
	 			authorctrl: item.rows[0].authorctrl,
	 			data: item.rows[0].data,
	 			ftid: item.rows[0].id,
	 			symbol: symbol
	 	};
	 	await wrapper.toLite(ASSETS_FT_DB.updateOne({ftid: objUpdate.ftid}, objUpdate, {upsert: true}));
	}
}


/**
 * Start history daemons aggregation
 */
aggregateHistoryAssets();

