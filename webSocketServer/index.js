const webSocketsServerPort = 8000;
const webSocketServer = require('websocket').server;
const http = require('http');
const Binance = require('node-binance-api');
const binance = new Binance().options({
  APIKEY: '6VWhdCuBEuQA7xA44YnBsnHSsU8rwaVL48hDPXANpEN01AVjZIjD8Z4pqwWA7Krv',
  APISECRET: '5TDSoxVPXrrHTfgJGhrvOrvHPftdTiNOlxb2TbclS9aaI7Xcfxtg5IdijKFCfAAp'
});

// Spinning the http server and the websocket server.
const server = http.createServer();
server.listen(webSocketsServerPort);
console.log('listening on port 8000');


const wsServer = new webSocketServer({
  httpServer: server
});

const clients = {};

// This code generates unique userid for everyuser.
const getUniqueID = () => {
  const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  return s4() + s4() + '-' + s4();
};

wsServer.on('request', function (request) {
  var userID = getUniqueID();
  console.log((new Date()) + ' Recieved a new connection from origin ' + request.origin + '.');

  // You can rewrite this part of the code to accept only the requests from allowed origin
  const connection = request.accept(null, request.origin);
  clients[userID] = connection;
  console.log('connected: ' + userID + ' in ' + Object.getOwnPropertyNames(clients));

  connection.on('message', function(message) {
    // if (message.type === 'utf8') {
    //   console.log('Received Message: ', message.utf8Data);

    //   // broadcasting message to all connected clients
    //   for(key in clients) {
    //     clients[key].sendUTF(message.utf8Data);
    //     console.log('sent Message to: ', clients[key]);
    //   }
    // }
    binance.websockets.chart("BNBBTC", "1m", (symbol, interval, chart) => {
      let tick = binance.last(chart);
      const last = chart[tick].close;
      // console.info(chart);
      // Optionally convert 'chart' object to array:
      // let ohlc = binance.ohlc(chart);
      // console.info(symbol, ohlc);
      console.info(symbol+" last price: "+last)
      for(key in clients) {
        //     clients[key].sendUTF(message.utf8Data);
        //     console.log('sent Message to: ', clients[key]);
        const conChart = { ...message, ...chart} 
        console.log(conChart)
        console.log(conChart.utf8Data)
        clients[key].sendUTF(JSON.stringify(chart))

      
      }
      console.log('sent Message to: ', clients[key]);
    });
  })
});