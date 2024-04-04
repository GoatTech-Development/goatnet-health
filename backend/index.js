var express = require("express");
var app = express();
var expressWs = require("express-ws")(app);
var cors = require("cors");
var pingService = require("./services/pingService");

app.use(cors({
  origin: "http://localhost:8080"
}));

app.ws("/ws", function(ws, req) {
  pingService.startPing(ws);

  ws.on("message", function(msg) {
    console.log(msg);
    if (msg === "toggleOutage") {
      pingService.toggleOutage();
    }
  });

  ws.on("close", function() {
    pingService.stopPing(ws);
  });
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
