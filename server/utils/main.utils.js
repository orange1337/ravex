/*
	Utils functions, created by orange1337
*/

class logWrapper { 
	constructor (logName){
		this.logName = logName;
	}
	info (result){
		console.log(`[${this.logName}]`, result);
	}
}

class asyncWrapper {
	constructor (logName){
		this.logName = logName;
	}
	toStrong (promise){
		return promise.then(result => result)
				  	  .catch(err => {
			  			  	console.error(this.logName, err);
			  			  	process.exit(1);
				  	  });
	}
	toLite (promise){
		return promise.then(result => result)
		  	  .catch(err => {
			 		  	console.error(this.logName, err);
			 		  	return;
		  	  });
	}
	to (promise){
		return promise.then(result => [null, result])
		  	  .catch(err => [err, null]);
	}
 	pause(func, timeout, fromId){
		return setTimeout(() => { func(fromId) }, timeout);
	}
}

async function asyncForEach(arr, cb) {
    for (let i = 0; i < arr.length; i++) {
         await cb(arr[i], i, arr);
    }
}

module.exports = { asyncWrapper, asyncForEach };