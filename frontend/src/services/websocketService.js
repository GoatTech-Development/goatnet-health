export const setupWebSocket = (updateChartData) => {
    const ws = new WebSocket('ws://localhost:3000');

    ws.onopen = () => {
        console.log('Connected to server');
        ws.send('Hello from client');
    };

    ws.onmessage = (message) => {
        console.log('Received:', message.data);
        // Update the chart data with the new latency value
        updateChartData(parseInt(message.data));
    };

    ws.onerror = (error) => {
        console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
        console.log('Disconnected from server');
    };

    return ws;
};
