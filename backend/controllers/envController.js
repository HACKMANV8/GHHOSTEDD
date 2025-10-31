import fs from "fs";
import path from "path";

const outputPath = path.resolve("models/output.json");

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
        const env = data.env_status_model || {};

        req.io.emit("env_update", {
          environment_status: env.status || "unknown",
          confidence_env: env.confidence || null,
          temperature: env.temperature || null,
          humidity: env.humidity || null,
          air_quality_index: env.air_quality_index || null,
        });

        // 🔴 If environment is danger, also emit survival data
        if (env.status === "danger" && data.survival_timer_model) {
          req.io.emit("survival_update", data.survival_timer_model);
        }
      } catch (err) {
        console.error("❌ Error reading output.json in interval:", err);
      }
    }, 2000);

    // Stop reading when request closes (optional cleanup)
    req.on("close", () => clearInterval(interval));
  } catch (err) {
    console.error("❌ Error setting up environment watcher:", err);
    res
      .status(500)
      .json({ success: false, message: "Error reading ML output setup" });
  }
};
