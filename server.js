const app = require('express')();
const http = require('http').createServer(app);


const io = require('socket.io')(http);

app.get('/', (req, res) => {
    console.log(__dirname);
  res.sendFile(__dirname + '/index.html');
});