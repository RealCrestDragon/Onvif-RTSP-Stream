const express = require("express"); //Import the express dependency
const Stream = require("./videoStream");
const path = require("path");
const app = express(); //Instantiate an express app, the main work horse of this server
const port = 5000; //Save the port number where your server will be listening
const ws = require("ws");

let videoSocketServer = null;
//Idiomatic expression in express to route and respond to a client request
app.get("/jsmpeg.min.js", function (req, res) {
  res.sendFile(path.join(__dirname + "/jsmpeg.min.js"));
});

app.get("/", (req, res) => {
  if (videoSocketServer) {
    videoSocketServer.on("connection", (socket, request) => {
      return Stream.prototype.onSocketConnect(socket, request);
    });
  } else {
    const stream = new Stream({
      name: "name",
      streamUrl:
        "rtsp://zephyr.rtsp.stream/movie?streamKey=9a2496cd308ae363398d225397a76be7",
      wsPort: 9999,
    });
    videoSocketServer = stream.wsServer;
  }
  //get requests to the root ("/") will route here

  res.sendFile(path.join(__dirname, "/index.html")); //server responds by sending the index.html file to the client's browser
  //the .sendFile method needs the absolute path to the file, see: https://expressjs.com/en/4x/api.html#res.sendFile
});

app.listen(port, () => {
  //server starts listening for any attempts from a client to connect at port: {port}
  console.log(`Now listening on port ${port}`);
});
