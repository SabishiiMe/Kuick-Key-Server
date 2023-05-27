require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app)
const { Server } = require("socket.io");
const { Datastore } = require("@google-cloud/datastore");
const { Storage } = require("@google-cloud/storage");
const helpers = require("./helpers.js")
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENTURL,
        methods: ["GET"]
        
    }
});

// Add Access Control Allow Origin headers
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", process.env.CLIENTURL);
    res.header(
      "Access-Control-Allow-Headers"
    );
    next();
  });

// Variables
const datastore = new Datastore()
const storage = new Storage()
const PORT = process.env.PORT; 

app.get("/soup", (req, res) => {
    res.json(
        {
            "soup": "worm"
        }
    )
})

// Grabs the leaderboard information on client start
app.get("/leaderboard", async (req, res) => {
    let leaderboardEntries = await helpers.fetchLeaderboardEntries(datastore);
    return res.json(leaderboardEntries)
})

io.on("connection", socket => {
    
    // When receiving a message
    socket.on("append-message", (json, session) => {
        if (session === "")
        {
            socket.broadcast.emit("broadcast-message", json)
        } else {
            socket.to(session).emit("broadcast-message", json)
        }
    })

    socket.on("join-session", session => {
        socket.join(session)
        
        const clients = io.sockets.adapter.rooms.get("0000")

        io.to(session).emit("players-session", clients.size)

    })
})

server.listen(PORT, () => {
    console.log("Listening on " + PORT);
})