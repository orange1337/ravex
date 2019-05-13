/*
	History aggregation Worker, created by orange1337  
*/
const { eos, 
		ORDERS_DB, 
		SETTINGS_DB, 
		SELLS_FT_DB,
		log, 
		config, 
		request, 
		md5,
		sendSocketUpdate,
		wrapper,
		asyncForEach
	 } = require('./header')('history_daemon');

const timeout 	 = config.daemons.timeoutHistory;
let globalHashes = {};

/**
 * [aggregateHistoryMarket - Aggregate history from Market contract]
 */
async function aggregateHistoryMarket(){
	let settings = await wrapper.toStrong(SETTINGS_DB.findOne({}));
	if (!settings){
		settings = new SETTINGS_DB();
		await wrapper.toStrong(settings.save());
	}
	await getTransfers(settings);
	
	await wrapper.toStrong(settings.save());
	console.log('===== END market aggregation', settings);
	setTimeout(aggregateHistoryMarket, timeout);
}
	
async function getTransfers(settings){
	let limit = 1000;
	let skip  = settings.cursor_history;
	console.log('===== assets skip =====', skip);
	let options = {
		uri: `${config.historyChain}/v1/history/get_actions`,
		method: 'POST',
		json: true,
	  	body: {
	  		account_name: config.market,
	  		pos: skip,
	  		offset: limit
	  	}
	}
	let [err, transfer] = await wrapper.to(request(options));
	if (err){
		log.error(err);
		return;
	}
	if (transfer.actions.length === 0){
			return;
	}
	await saveOrders(transfer);
	settings.cursor_history += transfer.actions.length;
	getTransfers(settings);
}
	
async function saveOrders(data){
	for (let elem of data.actions){
		if (elem.act){
			elem.action_trace = { act: elem.act, 
								  trx_id: elem.trx_id, 
								  receipt: elem.receipt, 
								  block_time: elem.block_time 
								};
		}
		let act = elem.action_trace.act;
		let ifArray = act.data && act.data.assetids;
		let hash = md5(elem.action_trace.trx_id + elem.action_trace.act.hex_data);
		
		if (globalHashes[hash]){
			delete globalHashes[hash];
		} else {
			globalHashes[hash] = true;
			if ( (act.name === 'transferf' && act.data.from === config.market && act.data.memo.indexOf('sellid') >= 0) || 
				 (act.account === 'eosio.token' && act.name === 'transfer' && act.data.to === config.market && act.data.memo.indexOf('ftid') >= 0) ||
				 (act.name === 'offerf' && act.data.owner === config.market) 
			   ) 
			{
				let memo;
				try {
					memo = JSON.parse(act.data.memo);
				} catch(e) {
					memo = {};
				}
				if (memo.sellid && memo.ftid){
					memo.sellid = Number(memo.sellid);
					let parseQty = act.data.quantity.split(" ");
					act.name = 'buyf';
					let updateObj = {
						ftid: memo.ftid,
						active: false,
						time: new Date(elem.action_trace.block_time),
						owner: (act.data.newowner) ? act.data.newowner : act.data.to,
						author: act.data.author,
						quantity: act.data.quantity,
						qtyNum: Number(parseQty[0]),
						symbol: parseQty[1],
						status: 'CLOSED'
					};
					sendSocketUpdate({ name: act.name, sellid: memo.sellid }, 'ft/wallet');
					await wrapper.toLite(SELLS_FT_DB.updateOne({ sellid: memo.sellid }, updateObj, { upsert: true }));
				}
				if (memo.ftid && !memo.sellid){
					memo.ftid = Number(memo.ftid);
					let price = act.data.quantity;
					let priceNum = Number(price.split(" ")[0]);
					await wrapper.toLite(SELLS_FT_DB.updateOne({ sellid: memo.ftid }, { price, priceNum }, { upsert: true }));
				}
			}
			if (act.name === 'cancelf') {
				let sellid = act.data.ftsid;
				sendSocketUpdate(act, 'ft/wallet');
				await wrapper.toLite(SELLS_FT_DB.updateOne({ sellid }, { active: false, status: 'CANCELED' }, { upsert: true }));
			} 
		}
	}
}

/**
 * Start history daemons aggregation
 */
aggregateHistoryMarket();
