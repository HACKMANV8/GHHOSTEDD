import fs from "fs";
import path from "path";

const outputPath = path.resolve("./backend/predictions.json");

export const getSurvivalTime = (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Survival time monitoring started and emitting every 2 seconds",
    });

    // Run every 2 seconds
    const interval = setInterval(() => {
      try {
        const data = JSON.parse(fs.readFileSync(outputPath, "utf-8"));

        // 🧠 Extract new format fields
        const envStatus = data.env_status?.[0] || "Unknown";
        const survivalTime = data.survival_prediction?.[0]?.[0] || null;

        // 🔵 Emit survival update to all connected clients
        req.io.emit("survival_update", {
          environment_status: envStatus,
          survival_time_seconds: survivalTime,
        });
      } catch (err) {
        console.error("❌ Error reading predictions.json:", err);
      }
    }, 2000);

    // 🧹 Clean up when client disconnects
    req.on("close", () => clearInterval(interval));
  } catch (err) {
    console.error("❌ Error setting up survival watcher:", err);
    res
      .status(500)
      .json({ success: false, message: "Error reading ML output setup" });
  }
};
