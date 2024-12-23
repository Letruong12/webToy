/*
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
app.get('/', function(req, res){
    res.sendFile(__dirname + '/chat.html');
});
io.on('connection', function(socket){
    socket.on('chat message', function(msg){
        io.emit('chat message', msg);
    });
});
http.listen(3000, function(){
    console.log('listening on *:3000');
});
*/


var express = require('express');
var router = express.Router();
var path = require('path');

// Serve the chat.html file
router.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '../public/chat.html'));
});

module.exports = router;
