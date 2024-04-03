var express = require('express');
var app = express();
var expressWs = require('express-ws')(app);
var ping = require('ping');

app.use(function (req, res, next) {
    console.log('middleware');
    req.testing = 'testing';
    return next();
});

app.get('/', function (req, res, next) {
    console.log('get route', req.testing);
    res.end();
});

app.ws('/', function (ws, req) {
    ws.on('message', function (msg) {
        console.log(msg);
    });
    console.log('socket', req.testing);

    // Ping Google every 5 seconds and send the latency over the WebSocket connection
    setInterval(function() {
        ping.promise.probe('google.com')
            .then(function (res) {
                ws.send(res.time);
            });
    }, 5000);
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});
