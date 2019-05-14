/**
 * API for Fungible Tokens, created by orange1337
 */

module.exports = function(router, config, request, log, mongoMain, eos, wrapper) {

	const elemLimit = config.daemons.limitSells;
	const limitPurchases = 20;
	const limitPopular = 50;
	const limitDef = 100;

	const { SELLS_FT_DB, 
			CLAIMS_FT_DB, 
			ASSETS_FT_DB
    } = mongoMain;

    const assetJoinQuery = (DB, match, skip = 0, limit = limitDef, sort = {sellid: -1}) => {
		let matchQuery = [{ $match: match }];
		if (sort){
			matchQuery.push({ $sort: sort })
		}
		if (skip !== 0){
			matchQuery.push({ $skip: skip })
		}
		if (limit !== 0){
			matchQuery.push({ $limit: limit })
		}
		return DB.aggregate([
			...matchQuery,
			{
      			$lookup: {
      			   from: "FT_ASSETS",
      			   localField: "ftid", 
      			   foreignField: "ftid",
      			   as: "orderData"
      			}
			},
   			{
   			   $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$orderData", 0 ] }, "$$ROOT" ] } }
   			},
   			{ $project: { orderData: 0 } }
	    ]);
	}
	
	router.get('/api/v1/ft/coins', async (req, res) => {
		let skip = 0;
		let limit = 6;
		let last24H = new Date(+new Date() - 86400000);
		let queryActiveCoins = [
			{ $match: { active: true } },
			{ 
			  $group: { 
				_id: { ftid: "$ftid", symbol: "$symbol" },
				qty: { $sum: "$qtyNum" }
			  } 
			},
			{ $sort: { qty: -1 } }
		];
		let queryPrice = [
			{ $match: { status: "CLOSED" } },
			{ $sort: { time: 1 } },
			{ 
			  $group: { 
				_id: { ftid: "$ftid", symbol: "$symbol" },
				price: { $last: "$priceNum" }
			  } 
			}
		];
		let query24H = [
			{ $match: { status: "CLOSED", time: { $gte: last24H } } },
			{ $sort: { time: 1 } },
			{ 
			  $group: { 
				_id: { ftid: "$ftid", symbol: "$symbol" },
				priceMin: { $min: "$priceNum" },
				priceMax: { $max: "$priceNum" },
				volume: { $sum: "$qtyNum" }
			  } 
			}
		];
		let pq_1 = wrapper.to(SELLS_FT_DB.aggregate(queryActiveCoins));
		let pq_2 = wrapper.to(SELLS_FT_DB.aggregate(queryPrice));
		let pq_3 = wrapper.to(SELLS_FT_DB.aggregate(query24H));

		let [err1, coins] = await pq_1; 
		let [err2, price] = await pq_2; 
		let [err3, vol] = await pq_3; 
		if (err1 || err2 || err3){
			log.error(err1 || err2 || err3);
			return res.status(500).end();
		}
		res.json({ coins, price, vol });
	});

	router.get('/api/v1/ft/market', async (req, res) => {
		let skip 		= Number(req.query.skip) || 0;
		let limit 		= Number(req.query.limit) || limitDef;
		if (skip < 0){
			res.status(401).send(`Wrong Skip ${skip}`)
		}
		if (limit <= 0 || limit > limitDef){
			res.status(401).send(`Limit from 0 till ${limitDef}`)
		}
		let author 	= (req.query.author && req.query.author !== 'undefined') ? req.query.author : null;
		let symbol 	= (req.query.symbol && req.query.symbol !== 'undefined') ? req.query.symbol : null;

		let query = [
			{ $match: { active: true, author, symbol } },
			{ $addFields: { priceOne: { $divide: [ "$priceNum", "$qtyNum" ] } } },
			{ $sort: { priceOne: -1 } },
			{ $skip: skip },
			{ $limit: limit }
		];
		let sellsf = wrapper.to(SELLS_FT_DB.aggregate(query));
		let token  = wrapper.to(ASSETS_FT_DB.findOne({issuer: author, symbol}));

		let [err, orders] = await sellsf;
		let [errT, tokenInfo] = await token;
		if (err || errT){
			log.error(err || errT);
			return res.status(500).end();
		}
		res.json({orders, tokenInfo});
	});

	router.post('/api/v1/items/assetids/ft', async (req, res) => {
		let ftids = req.body.ftids;
		let query = [
			{ $match: { sellid: { $in: ftids } } },
			{
      			$lookup: {
      			   from: "FT_ASSETS",
      			   localField: "ftid", 
      			   foreignField: "ftid",
      			   as: "orderData"
      			}
			},
			{
   			   $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$orderData", 0 ] }, "$$ROOT" ] } }
   			},
   			{ $project: { orderData: 0 } }
	    ]
		let [err, items]  = await wrapper.to(SELLS_FT_DB.aggregate(query)); //.limit(limitPopular)
		if (err){
			log.error(err);
			return res.status(500).end();
		}
		res.json(items);
	});

	router.get('/api/v1/ft/chart', async (req, res) => {
		let dateFromDefault = +new Date() - 1000 * 3600 * 24 * 7 * 2; // last 2 weeks
		let from 	= new Date(Number(req.query.from) || dateFromDefault);
		let author 	= (req.query.author && req.query.author !== 'undefined') ? req.query.author : null;
		let symbol 	= (req.query.symbol && req.query.symbol !== 'undefined') ? req.query.symbol : null;
		if (!author || !symbol){
			return res.status(500).send("Wrong author || symbol!");
		}
		let query = [
			{ $match: { active: false,
					  	status: 'CLOSED',
					  	author,
					  	symbol,
					  	time: { $gte: from }
					  }
		 	},
			{ $project: { time: 1, price: { $divide: [ "$priceNum", "$qtyNum" ] } } },
			{ $sort: { price: 1 } },
		];

		let [err, items] = await wrapper.to(SELLS_FT_DB.aggregate(query));
		if (err){
			log.error(err);
			return res.status(500).end();
		}
		res.json(items);
	});

	router.get('/api/v1/ft/opened/:owner', async (req, res) => {
		let skip 	= Number(req.query.skip) || 0;
		let limit 	= Number(req.query.limit) || limitDef;
		let owner 	= req.params.owner;
		if (skip < 0){
			res.status(401).send(`Wrong Skip ${skip}`)
		}
		if (limit <= 0 || limit > limitDef){
			res.status(401).send(`Limit from 0 till ${limitDef}`)
		}
		let match = { owner, active: true };
		let [err, items] = await wrapper.to(assetJoinQuery(SELLS_FT_DB, match, skip, limit));
		if (err){
			log.error(err);
			return res.status(500).end();
		}
		res.json(items);
	});

	router.post('/api/v1/ft/items/ids', async (req, res) => {
		let ids = req.body.ftids;
		let [err, items] = await wrapper.to(ASSETS_FT_DB.find({ ftid: { $in: ids } }, 'ftid data symbol issuer'));
		if (err){
			log.error(err);
			return res.status(500).end();
		}
		res.json(items);
	});

	router.get('/api/v1/ft/orders/:account', async (req, res) => {
		let skip 		= Number(req.query.skip) || 0;
		let limit 		= Number(req.query.limit) || limitDef;
		if (skip < 0){
			res.status(401).send(`Wrong Skip ${skip}`)
		}
		if (limit <= 0 || limit > limitDef){
			res.status(401).send(`Limit from 0 till ${limitDef}`)
		}
		let owner 	= String(req.params.account);
		let match  = { active: true, owner };

		let [err, items] = await wrapper.to(assetJoinQuery(SELLS_FT_DB, match, skip, limit));
		if (err){
			log.error(err);
			return res.status(500).end();
		}
		res.json(items);
	});

	router.get('/api/v1/ft/claims/:account', async (req, res) => {
		let skip 		= Number(req.query.skip) || 0;
		let limit 		= Number(req.query.limit) || limitDef;
		if (skip < 0){
			res.status(401).send(`Wrong Skip ${skip}`)
		}
		if (limit <= 0 || limit > limitDef){
			res.status(401).send(`Limit from 0 till ${limitDef}`)
		}
		let offeredto = String(req.params.account);
		let match  	  = { active: true, offeredto };

		let [err, items] = await wrapper.to(assetJoinQuery(CLAIMS_FT_DB, match, skip, limit));
		if (err){
			log.error(err);
			return res.status(500).end();
		}
		res.json(items);
	});

	router.get('/api/v1/ft/canceloffers/:account', async (req, res) => {
		let skip 		= Number(req.query.skip) || 0;
		let limit 		= Number(req.query.limit) || limitDef;
		if (skip < 0){
			res.status(401).send(`Wrong Skip ${skip}`)
		}
		if (limit <= 0 || limit > limitDef){
			res.status(401).send(`Limit from 0 till ${limitDef}`)
		}
		let owner = String(req.params.account);
		let match = { active: true, owner };

		let [err, items] = await wrapper.to(assetJoinQuery(CLAIMS_FT_DB, match, skip, limit));
		if (err){
			log.error(err);
			return res.status(500).end();
		}
		res.json(items);
	});

	router.get('/api/v1/ft/notify/:account', async (req, res) => {
		let account 	= String(req.params.account);
		let claims 		= CLAIMS_FT_DB.find({offeredto: account, active: true}).countDocuments();
		let orders 		= SELLS_FT_DB.find({owner: account, active: true}).countDocuments();
		let cancel 		= CLAIMS_FT_DB.find({owner: account, active: true}).countDocuments();

		try {
			claims = await claims;
			orders = await orders;
			cancel = await cancel;
		} catch(e){
			log.error(err);
			return res.status(500).end();
		}
		res.json({orders, claims, cancel});
	});
}



