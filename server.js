// Express
const express = require("express");
const app = express();


app.get("/test", (req, res) => {
    res.json(
        {
            "soup": "worm"
        }
    )
})

app.listen(4311, () => {console.log("Server is up and running on port 4311!")})

// -------------------------------------------------------------------------------------------
// Socket IO 
const io = require("socket.io")(4312, {
    cors: {
        origin: ["http://localhost:3000"],
    }
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