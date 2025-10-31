// socket/socketHandler.js
export const setupSocketHandlers = (io) => {
  // Store mapping between adminId → their rooms
  const adminRooms = new Map();

  io.on("connection", (socket) => {
    console.log("🟢 Socket connected:", socket.id);

    // 🔹 When admin creates a new mission room
    socket.on("create_mission_room", ({ adminId, missionId }) => {
      const roomName = `mission_${missionId}`;
      socket.join(roomName);

      if (!adminRooms.has(adminId)) {
        adminRooms.set(adminId, []);
      }
      adminRooms.get(adminId).push(roomName);

      console.log(`🛰️ Admin ${adminId} created & joined room ${roomName}`);
      io.to(roomName).emit("room_created", { room: roomName });
    });

    // 🔹 When a node joins a mission room
    socket.on("join_mission", ({ nodeId, missionId }) => {
      const roomName = `mission_${missionId}`;
      socket.join(roomName);
      console.log(`🤖 Node ${nodeId} joined ${roomName}`);
      io.to(roomName).emit("node_joined", { nodeId, room: roomName });
    });

    // 🔹 Mission updates broadcast
    socket.on("mission_update", ({ missionId, data }) => {
      const roomName = `mission_${missionId}`;
      io.to(roomName).emit("mission_data", { missionId, data });
      console.log(`📡 Data broadcasted to ${roomName}`);
    });

    // 🔹 When client disconnects
    socket.on("disconnect", () => {
      console.log(`🔴 Socket disconnected: ${socket.id}`);
    });
  });
};
