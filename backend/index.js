import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";

dotenv.config();

// Initialize Express
const app = express();
const PORT = process.env.PORT || 3000;

// Create HTTP server and attach socket.io
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // change to your frontend domain in production
    methods: ["GET", "POST"]
  }
});




// MongoDB connection
import connectToMongoDB from "./mongoconnection.js";
connectToMongoDB();




// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// route file import
import noderoute from "./routes/noderoutes.js";


app.use("/api", noderoute(io));





// Socket.IO connection
io.on("connection", (socket) => {
  console.log(`🟢 User connected: ${socket.id}`);

  // Example: receive a message
  socket.on("sendMessage", (data) => {
    console.log("Message received:", data);
    // Broadcast to all connected clients
    io.emit("receiveMessage", data);
  });

  // When user disconnects
  socket.on("disconnect", () => {
    console.log(`🔴 User disconnected: ${socket.id}`);
  });
});

// Start server
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
