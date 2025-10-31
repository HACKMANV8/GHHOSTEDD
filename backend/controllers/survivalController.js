import fs from "fs";
import path from "path";

const outputPath = path.resolve("models/output.json");

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
        const surv = data.survival_timer_model || {};

        req.io.emit("survival_update", {
          survival_time_seconds: surv.estimated_survival_time_sec || null,
          confidence_survival: surv.confidence || null,
          alert_level: surv.alert_level || "normal",
        });
      } catch (err) {
        console.error("❌ Error reading output.json in interval:", err);
      }
      
    }, 2000);

    // Stop when client disconnects or request closes
    req.on("close", () => clearInterval(interval));
  } catch (err) {
    console.error("❌ Error setting up survival watcher:", err);
    res
      .status(500)
      .json({ success: false, message: "Error reading ML output setup" });
  }
};
