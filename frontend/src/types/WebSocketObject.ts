// src/types/WebSocketObject.ts
import ReconnectingWebSocket from "reconnecting-websocket";

export interface WebSocketObject {
  ws: ReconnectingWebSocket;
}
