import express from 'express';
import expressWs from "express-ws";
import cors from "cors";
import * as pingService from './services/pingService';

const expressServer = express();           // Type = Express
const wsServer = expressWs(expressServer); // Type = expressWs.Instance
const server = wsServer.app;               // type = wsExpress.Application

expressServer.use(cors({
  origin: "http://localhost:8080"
}));

expressServer.ws("/ws", (ws: expressWs.WebSocket) => {
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

expressServer.listen(3000, () => {
  console.log("Server started on port 3000");
});
