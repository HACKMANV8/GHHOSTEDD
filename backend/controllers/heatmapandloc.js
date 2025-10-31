// backend/controllers/heatmapandloc.js

export const sendHeatmapData = (io) => {
  // Hardcoded heatmap data
  const data = [
    { lat: 12.9716, lng: 77.5946, intensity: 0.8 },
    { lat: 12.9722, lng: 77.5955, intensity: 0.6 },
    { lat: 12.9750, lng: 77.5900, intensity: 0.9 },
  ];

  // Broadcast the heatmap data to all connected clients
  io.emit("heatmap-data", data);

  console.log("✅ Heatmap data sent via socket");
};
