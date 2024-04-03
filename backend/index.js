var express = require('express');
var app = express();
var expressWs = require('express-ws')(app);
var ping = require('ping');
var cors = require('cors');

// Set up CORS to only allow connections from your frontend
app.use(cors({
    origin: 'http://localhost:8080' // Replace with the URL of your frontend
}));

// Keep track of active WebSocket connections and their corresponding intervals
var connections = new Map();
var simulateOutage = false;

app.ws('/', function (ws, req) {
    // Ping Google every 5 seconds and send the latency over the WebSocket connection
    var interval = setInterval(function () {
        if (simulateOutage) {
            // Simulate an internet outage
            if (ws.readyState === ws.OPEN) {
                ws.send(-1);
            }
            console.log('Simulated internet outage at', new Date().toLocaleString('en-US', {timeZone: 'America/Los_Angeles'}));
        } else {
            ping.promise.probe('google.com')
                .then(function (result) {
                    if (result.alive) {
                        // Send the latency to the active WebSocket connection
                        if (ws.readyState === ws.OPEN) {
                            ws.send(result.time);
                        }
                        console.log('Latency:', result.time, 'ms at', new Date().toLocaleString('en-US', {timeZone: 'America/Los_Angeles'}));
                    } else {
                        // Send a special value to indicate that the internet is out
                        if (ws.readyState === ws.OPEN) {
                            ws.send(-1);
                        }
                        console.log('Internet is out at', new Date().toLocaleString('en-US', {timeZone: 'America/Los_Angeles'}));
                    }
                });
        }
    }, 5000);

    connections.set(ws, interval);

    ws.on('message', function (msg) {
        console.log(msg);
        if (msg === 'toggleOutage') {
            simulateOutage = !simulateOutage;
        }
    });

    ws.on('close', function () {
        clearInterval(connections.get(ws));
        connections.delete(ws);
    });
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});
