import fs from "fs";
import path from "path";

const outputPath = path.resolve("./backend/predictions.json");

export const getEnvStatus = (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Environment monitoring started and emitting every 2 seconds",
    });

    // Run every 2 seconds
    const interval = setInterval(() => {
      try {
        const data = JSON.parse(fs.readFileSync(outputPath, "utf-8"));

        // 🧠 Updated fields based on new ML output format
        const envStatus = data.env_status?.[0] || "Unknown";
        const survivalPrediction = data.survival_prediction?.[0]?.[0] || null;

        // 🔵 Emit environment update
        req.io.emit("env_update", {
          environment_status: envStatus,
        });

        // 🔴 If environment is Caution or Danger → emit survival info
        if (envStatus === "Caution" || envStatus === "Danger") {
          req.io.emit("survival_update", {
            survival_time: survivalPrediction,
          });
        }
      } catch (err) {
        console.error("❌ Error reading predictions.json:", err);
      }
    }, 2000);

    // 🧹 Stop reading when request closes
    req.on("close", () => clearInterval(interval));
  } catch (err) {
    console.error("❌ Error setting up environment watcher:", err);
    res
      .status(500)
      .json({ success: false, message: "Error reading ML output setup" });
  }
};
