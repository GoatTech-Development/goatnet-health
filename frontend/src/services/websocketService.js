import config from "@/config.js";

let lastLatency = null;
let interval = null;

export const setupWebSocket = (updateChartData) => {
  const ws = new WebSocket(config.wsUrl);
  let isOutageOngoing = false;

  ws.onopen = () => {
    console.log("Connected to server at time: ", new Date().toLocaleString());
    ws.send("Hello from client at time: " + new Date().toLocaleString());
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
    console.log("Disconnected from server at time: ", new Date().toLocaleString());
    // Emit the 'outage' event
    const event = new CustomEvent("outage", { detail: new Date() });
    window.dispatchEvent(event);
    console.log("Dispatched outage event at time: ", new Date().toLocaleString());

    // Clear any existing interval
    if (interval) {
      clearInterval(interval);
    }

    // Immediately append the lastLatency to the lineOutage TimeSeries
    updateChartData(lastLatency, true);

    // Set up a new interval to append the lastLatency to the lineOutage TimeSeries every 5 seconds
    interval = setInterval(() => {
      updateChartData(lastLatency, true);
    }, 5000);

  };

  return { ws };
};
