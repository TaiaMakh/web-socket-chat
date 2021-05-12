const webSocketsServerPort = 8000;
const webSocketServer = require('websocket').server;
const http = require('http');
const Binance = require('node-binance-api');
const binance = new Binance().options({
  APIKEY: '6VWhdCuBEuQA7xA44YnBsnHSsU8rwaVL48hDPXANpEN01AVjZIjD8Z4pqwWA7Krv',
  APISECRET: '5TDSoxVPXrrHTfgJGhrvOrvHPftdTiNOlxb2TbclS9aaI7Xcfxtg5IdijKFCfAAp'
});



// Spinning the http server and the websocket server.
//www
const server = http.createServer();
server.listen(webSocketsServerPort);
console.log('listening on port 8000');


const wsServer = new webSocketServer({
  httpServer: server
});

wsServer.on('request', function (request) {
  // var userID = getUniqueID();
  console.log((new Date()) + ' Recieved a new connection from origin ' + request.origin + '.');

  //!!request.origin = url del front
  const connection = request.accept(null, request.origin);

  connection.on('message', function() {
   
    binance.websockets.chart("BNBBTC", "1m", (symbol, interval, chart) => {
      let tick = binance.last(chart);
      const last = chart[tick].close;
      // console.info(chart);
      // Optionally convert 'chart' object to array:
      // let ohlc = binance.ohlc(chart);
      // console.info(symbol, ohlc);
      console.info(symbol+" last price: "+last)
        connection.sendUTF(JSON.stringify(chart))

      console.log('sent Message to: ', connection);
    });
  })
});