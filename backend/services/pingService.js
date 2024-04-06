var ping = require("ping");
var config = require("../backendConfig.js");

var simulateOutage = false;
var connections = new Map();

function startPing(ws) {
  var interval = setInterval(function() {
    if (simulateOutage) {
      if (ws.readyState === ws.OPEN) {
        ws.send(-1);
      }
      console.log("Simulated internet outage at", new Date().toLocaleString(config.locale, { timeZone: config.timeZone }));
    } else {
      ping.promise.probe("google.com")
        .then(function(result) {
          if (result.alive) {
            if (ws.readyState === ws.OPEN) {
              ws.send(result.time);
            }
            console.log("Latency:", result.time, "ms at", new Date().toLocaleString(config.locale, { timeZone: config.timeZone }));
          } else {
            if (ws.readyState === ws.OPEN) {
              ws.send(-1);
            }
            console.log("Internet is out at", new Date().toLocaleString(config.locale, { timeZone: config.timeZone }));
          }
        });
    }
  }, 5000);

  connections.set(ws, interval);
}

function stopPing(ws) {
  clearInterval(connections.get(ws));
  connections.delete(ws);
}

function toggleOutage() {
  simulateOutage = !simulateOutage;
}

module.exports = {
  startPing,
  stopPing,
  toggleOutage
};
