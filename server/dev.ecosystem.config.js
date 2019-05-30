module.exports = {
  apps : [{
    name: `api`,
    script    : `./server/server.js`,
    watch: true
  },
  {
    name        : `sells_table`,
    script      : `./server/workers/sells.worker.js`,
    watch: true
  },
  {
    name        : `claims_table`,
    script      : `./server/workers/claims.worker.js`,
    watch: true
  },
  {
    name        : `market_history`,
    script      : `./server/workers/market.history.worker.js`,
    watch: true
  },
  {
    name        : `market_history`,
    script      : `./server/workers/assets.history.worker.js`,
    watch: true
  }]
}