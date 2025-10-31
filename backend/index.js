import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors"; // 1. Import cors

dotenv.config();

// Initialize Express
const app = express();
// Allow configuring frontend origin via env for flexibility
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:3000';
const PORT = process.env.PORT || 4000; // Using 4000 as default for backend

// Create HTTP server and attach socket.io
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: FRONTEND_ORIGIN,
    methods: ["GET", "POST"],
    credentials: true,
  }
});

// MongoDB connection
import connectToMongoDB from "./mongoconnection.js";
connectToMongoDB();

// Middleware
// Use CORS middleware with a specific origin and credentials enabled.
// When the frontend sends requests with credentials (cookies, withCredentials:true),
// the Access-Control-Allow-Origin response header must be the specific origin
// (not '*') and Access-Control-Allow-Credentials must be true.
app.use(cors({
  origin: FRONTEND_ORIGIN,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// route file import
import noderoute from "./routes/noderoutes.js";

// All routes will be prefixed with /api
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