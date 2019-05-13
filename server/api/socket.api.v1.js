/*
   Created by eoswebnetbp1
*/

let SOCKET_MAIN = 'pool';
let SOCKET_ROOM = {};
let userCountHandler = 0;

module.exports = (io, router, config, request, log, mongoMain, eos, metrics, wrapper) => {

  io.walletPool = {};
  io.on('connection', socket => {
    if (socket.handshake.query && socket.handshake.query.account){
        io.walletPool[socket.handshake.query.account] = socket;
    }
    socket.join(SOCKET_MAIN);
    metrics.users.set(userCountHandler+=1);

    socket.on('disconnect', () => {
      socket.leave(SOCKET_MAIN);
      metrics.users.set(userCountHandler-=1);
    });
  });

  router.post('/api/v1/socket/ft/wallet/:token', (req, res) => {
        let token = String(req.params.token);
        let act = req.body.act;
        if (token !== config.socketToken){
            log.error(`Wrong Token Secret - ${req.params.token}`);
            return res.status(500).end();
        }
        if (act.name === 'claimf' && req.io.walletPool[act.data.claimer]){
            req.io.walletPool[act.data.claimer].emit('claimf', act.data.ftofferids);
            req.io.walletPool[act.data.claimer].emit('notify', true);
        }
        if (act.name === 'cancelofferf' && req.io.walletPool[act.data.owner]){
            req.io.walletPool[act.data.owner].emit('cancelofferf', act.data.ftofferids);
            req.io.walletPool[act.data.owner].emit('notify', true);
        }
        if (act.name === 'cancelf'){
            req.io.to(SOCKET_MAIN).emit('cancelf', act.data.ftsid);
            req.io.to(SOCKET_MAIN).emit('notify', true);
        }
        if (act.name === 'buyf'){
            req.io.to(SOCKET_MAIN).emit('buyf', act.sellid);
        }
        if (act.name === 'detachf'){
            req.io.to(SOCKET_MAIN).emit('detachf', { author: act.data.author, quantity: act.data.quantity });
        }
        if (act.name === 'offerf' && req.io.walletPool[act.data.owner]){
            req.io.walletPool[act.data.owner].emit('notify', true);
        }
        res.end();
  });

  // ### end socket 
}



