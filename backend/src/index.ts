import express from 'express';
import expressWs from "express-ws";
import cors from "cors";
import * as pingService from './services/pingService';

const expressServer = express();           // Type = Express
const router = express.Router() as expressWs.Router;

expressServer.use(cors({
  origin: "http://localhost:8080"
}));

router.ws("/ws", (ws) => {
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
