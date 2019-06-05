/**
 * Main middlewares
 */
const limitDef = 100;

function checkSkipLimit(req, res, next) {
	let skip 		= Number(req.query.skip) || 0;
	let limit 		= Number(req.query.limit) || limitDef;
	if (skip < 0){
		return res.status(401).send(`Wrong Skip ${skip}`)
	}
	if (limit <= 0 || limit > limitDef){
		return res.status(401).send(`Limit from 0 till ${limitDef}`)
	}
	req.query.skip = skip;
	req.query.limit = limit;
	next();
}

module.exports = {
	checkSkipLimit
};