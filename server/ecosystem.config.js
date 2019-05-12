module.exports = {
  apps : [{
    name: `api`,
    script    : `./server/server.js`,
    //instances : `2`,
    //exec_mode : `cluster`
  },
  {
    name        : `sells_table`,
    script      : `./server/workers/sells.worker.js`
  },
  {
    name        : `claims_table`,
    script      : `./server/workers/claims.worker.js`
  },
  {
    name        : `market_history`,
    script      : `./server/workers/market.history.worker.js`
  }]
}