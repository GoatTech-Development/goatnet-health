var express = require('express');
var app = express();
var expressWs = require('express-ws')(app);
var ping = require('ping');

// Keep track of active WebSocket connections and their corresponding intervals
var connections = new Map();

app.ws('/', function (ws, req) {
    // Ping Google every 5 seconds and send the latency over the WebSocket connection
    var interval = setInterval(function () {
        ping.promise.probe('google.com')
            .then(function (res) {
                // Send the latency to the active WebSocket connection
                if (ws.readyState === ws.OPEN) {
                    ws.send(res.time);
                }
                // log the latency to the console with time in PST
                console.log('Latency:', res.time, 'ms at', new Date().toLocaleString('en-US', {timeZone: 'America/Los_Angeles'}));
            });
    }, 5000);

    // Add the new WebSocket connection and its corresponding interval to the map
    connections.set(ws, interval);

    ws.on('message', function (msg) {
        console.log(msg);
    });
    ws.on('close', function () {
        // Clear the interval associated with the closed WebSocket connection
        clearInterval(connections.get(ws));
        // Remove the closed WebSocket connection and its corresponding interval from the map
        connections.delete(ws);
    });
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});
