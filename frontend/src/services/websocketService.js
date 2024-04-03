export const setupWebSocket = (updateChartData) => {
    const ws = new WebSocket('ws://localhost:3000');

    ws.onopen = () => {
        console.log('Connected to server');
        ws.send('Hello from client');
    };

    ws.onmessage = (message) => {
        console.log('Received:', message.data, 'at', new Date().toLocaleString('en-US', {timeZone: 'America/Los_Angeles'}));
        // Update the chart data with the new latency value
        updateChartData(parseInt(message.data));
    };

    ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        // Update the chart data with a special value to indicate an error
        updateChartData(-1);
    };

    ws.onclose = () => {
        console.log('Disconnected from server');
        // Update the chart data with a special value to indicate a disconnection
        updateChartData(-1);
    }

    return {ws};
};
