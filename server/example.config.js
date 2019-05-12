/*
  App configuration example
*/

const path = require('path');
let config = {};

// api version
config.apiV = 'v1'; 

// SA, SM contracts
config.market = 'simplemarket';
config.assets = 'simpleassets';

// host && port
config.port = '8088';
config.host = `http://localhost:${config.port}`;

// mongo uri and options
config.MONGO_URI = 'mongodb://localhost:27017/RAVEX';
config.MONGO_OPTIONS = {
    socketTimeoutMS: 30000,
    keepAlive: true,
    reconnectTries: 30000,
    useNewUrlParser: true
};

// Socket Token
config.socketToken = 'test1337';

// api url for history
config.daemons = {
    timeout: 1000, // 1 sec
    limitSells: 100,
    limitAssets: 1,
    limitClaims: 100,
    limitDelegates: 100,
    timeoutHistory: 3000 // 3sec
};
config.historyChain = "https://eos.greymass.com"; // https://api.eosrio.io
config.eosConfig    = {
  chainId: "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906",
  keyProvider: "",
  httpEndpoint: "https://bp.cryptolions.io",
  expireInSeconds: 60,
  broadcast: true,
  debug: false,
  sign: true,
  logger: {
    error: console.error
  }
};

// slack notifications
config.loggerSlack = {
      alerts: {
        type: 'slack',
        token: '',
        channel_id: '',
        username: 'System bot',
      }
};

module.exports = config;


