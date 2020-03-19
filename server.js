const fs = require('fs');
const path = require('path');
const https = require('https');
const express = require('express');
const app = express();
const app2 = express();
const expressWs = require('express-ws');

const serverOptions = {
  cert: fs.readFileSync(path.resolve(__dirname, 'certs/cert.crt')),
  key: fs.readFileSync(path.resolve(__dirname, 'certs/cert.key'))
};
const server = https.createServer(serverOptions, app);
expressWs(app, server);
expressWs(app2);

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.ws('/', function(ws, req) {
  let timeout;
  ws.on('open', function open() {
    console.log('connected');
    timeout = setTimeout(() => {
      ws.send(Date.now());
    }, 1000)
  });

  ws.on('close', function close() {
    timeout && clearTimeout(timeout);
    console.log('disconnected');
  });

  ws.on('message', function(msg) {
    console.log(msg);
  });
  console.log('socket', req.testing);
});

app2.get('/', function (req, res) {
  res.send('Hello World!');
});

app2.ws('/', function(ws, req) {
  ws.on('open', function () {
    console.log('connected');
  });

  ws.on('close', function () {
    console.log('disconnected');
  });

  ws.on('message', function(msg) {
    console.log(msg);
    ws.send(msg);
    if (msg === 'success') {

    } else if (msg === 'error') {

    }
  });

  ws.on('error', function(error) {
    console.error(error);
  });
});

server.listen(443, function () {
  console.log('Example app listening on port 443!');
});

app2.listen(8080, function () {
  console.log('Example app listening on port 8080!');
})
