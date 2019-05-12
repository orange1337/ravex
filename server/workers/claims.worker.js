/*
	Claims Worker, created by orange1337
*/
const { CLAIMS_FT_DB, 
		ASSETS_FT_DB, 
		log, 
		config, 
		eos,
		wrapper
	} = require('./header')('claims_daemon');

const timeout   	   = config.daemons.timeout; // 1 sec
const elemLimitClaims  = config.daemons.limitClaims;
const elemLimitAssets  = config.daemons.limitAssets;

async function generateClaimsHistoryFT(fromId){
	  let claimsTableFT = await wrapper.toStrong(eos.getTableRows({
	  			json: true,
			    code: config.assets,
			    scope: config.assets,
			    table: 'offerfs',
			    table_key: 'string',
			    lower_bound: fromId,
			    upper_bound: '-1',
			    limit: elemLimitClaims
	  }));

	  if (!claimsTableFT || !claimsTableFT.rows || !claimsTableFT.rows.length){
	  		console.log(`==== ClaimsFT cursor: `, fromId);
	  		return wrapper.pause(generateClaimsHistoryFT, timeout, 0);
	  }
	  for (let elem of claimsTableFT.rows){
	  	elem.claimid = elem.id;
	  	let quantity 	= elem.quantity.split(" ");
	  	elem.qtyNum 	= Number(quantity[0]);
	  	elem.symbol 	= quantity[1];
	  	elem.active     = true;
	  	await wrapper.toLite(CLAIMS_FT_DB.updateOne({ claimid: elem.claimid }, elem, { upsert: true }));
	  }
	  let lastClaimId = Number(claimsTableFT.rows[claimsTableFT.rows.length - 1].id);
	  wrapper.pause(generateClaimsHistoryFT, 0, (lastClaimId) ? lastClaimId + 1 : 0);
}

/**
 * Start workers
 */
generateClaimsHistoryFT(0);

