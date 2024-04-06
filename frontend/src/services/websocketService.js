let lastLatency = null;
export const setupWebSocket = (updateChartData) => {
  const ws = new WebSocket("ws://localhost:3000/ws");
  let isOutageOngoing = false;

  ws.onopen = () => {
    console.log("Connected to server");
    ws.send("Hello from client");
  };

  ws.onmessage = (message) => {
    console.log(
      "Received:",
      message.data,
      "at",
      new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" }),
    );
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
    console.error("WebSocket error:", error);
  };

  ws.onclose = () => {
    console.log("Disconnected from server");
  };

  return { ws };
};
