import * as ping from "ping";
import { locale, timezone } from "../../backendConfig";
import { WebSocket } from 'ws';

let simulateOutage = false;
const connections = new Map();

function startPing(ws: WebSocket) {
  let interval = setInterval(function() {
    if (simulateOutage) {
      if (ws.readyState === ws.OPEN) {
        ws.send(-1);
      }
      console.log("Simulated internet outage at", new Date().toLocaleString(locale, { timeZone: timezone }));
    } else {
      ping.promise.probe("google.com")
        .then(function(result) {
          if (result.alive) {
            if (ws.readyState === ws.OPEN) {
              ws.send(result.time);
            }
            console.log("Latency:", result.time, "ms at", new Date().toLocaleString(locale, { timeZone: timezone }));
          } else {
            if (ws.readyState === ws.OPEN) {
              ws.send(-1);
            }
            console.log("Internet is out at", new Date().toLocaleString(locale, { timeZone: timezone }));
          }
        });
    }
  }, 5000);

  connections.set(ws, interval);
}

function stopPing(ws: WebSocket) {
  clearInterval(connections.get(ws));
  connections.delete(ws);
}

function toggleOutage() {
  simulateOutage = !simulateOutage;
}

export {
  startPing,
  stopPing,
  toggleOutage
};
