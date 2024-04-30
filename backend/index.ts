const express = require('express');
const expressWs = require('express-ws');
const cors = require('cors');
const pingService = require('./services/pingService');

const app = express();
expressWs(app);

app.use(cors({
  origin: "http://localhost:8080"
}));

app.ws("/ws", (ws: any) => {
  pingService.startPing(ws);

  ws.on("message", (msg: string) => {
    console.log(msg);
    if (msg === "toggleOutage") {
      pingService.toggleOutage();
    }
  });

  ws.on("close", () => {
    pingService.stopPing(ws);
  });
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
