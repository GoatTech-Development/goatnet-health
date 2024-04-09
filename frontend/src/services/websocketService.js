import config from "@/config.js";
import ReconnectingWebSocket from "reconnecting-websocket";

let lastLatency = null;
let interval = null;

export const setupWebSocket = (updateChartData) => {
  const ws = new ReconnectingWebSocket(config.wsUrl, [], {
    maxReconnectionDelay: 10000, // Initial reconnection delay in milliseconds
    reconnectionDelayGrowFactor: 1.1, // Grow factor for reconnection delay
  });
  let isOutageOngoing = false;

  ws.onopen = () => {
    console.log("Connected to server at time: ", new Date().toLocaleString());
    ws.send("Hello from client at time: " + new Date().toLocaleString());

    // Clear any existing interval when the WebSocket reconnects
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
  };

  ws.onmessage = (message) => {
    console.log("Received:", message.data, "at", new Date().toLocaleString());
    if (parseInt(message.data) === -1) {
      // Begin lineOutage with the last value from lineUp for consistent graph look
      updateChartData(lastLatency, true);
      if (!isOutageOngoing) {
        // Emit the 'outage' event with the current timestamp
        const event = new CustomEvent("outage", { detail: new Date() });
        window.dispatchEvent(event);
        isOutageOngoing = true;
      }
    } else {
      // Update the chart data with the new latency value
      updateChartData(parseInt(message.data), false);
      // track the last latency value for lineOutage
      lastLatency = parseInt(message.data);
      isOutageOngoing = false;
    }
  };

  ws.onerror = (error) => {
    console.error("WebSocket error at time:", new Date().toLocaleString());
  };

  ws.onclose = () => {
    console.log("Disconnected from socket at time: ", new Date().toLocaleString());
    const event = new CustomEvent("dead", { detail: new Date() });
    window.dispatchEvent(event);

    // Clear any existing interval
    if (interval) {
      clearInterval(interval);
    }

    // Immediately append the lastLatency to the lineOutage TimeSeries
    updateChartData(lastLatency, true);
  };

  return { ws };
};
