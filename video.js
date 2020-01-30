var stdin = process.openStdin();

const WebSocketServer = require('ws').Server
const wss = new WebSocketServer({ port: 8081 });

wss.on('connection', ((ws) => {

  ws.on('message', (message) => {
    console.log(`received: ${message}`);
  });

  ws.on('end', () => {
    console.log('Connection ended...');
  });


  stdin.addListener("data", (input) => {
    //console.log(Buffer.from(input).toString('base64'));
    ws.send(Buffer.from(input).toString('base64'));
  });
}));

