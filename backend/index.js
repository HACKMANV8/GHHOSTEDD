import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import connectToMongoDB from "./mongoconnection.js";
import noderoute from "./routes/noderoutes.js";
import adminroute from "./routes/adminroutes.js";
import { setupWatcher } from "./utils/watcher.js";
import cors from "cors";

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
    origin: "*", // 👈 change this to your frontend URL before deploying
    methods: ["GET", "POST"],
  },
});

// MongoDB connection
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

// Routes
app.use("/api", noderoute(io));

// Socket.IO setup
io.on("connection", (socket) => {
  console.log("🟢 Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});

// ML model watcher setup
setupWatcher(io);

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
