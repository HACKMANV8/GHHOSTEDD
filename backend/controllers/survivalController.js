import fs from "fs";
import path from "path";

const outputPath = path.resolve("models/output.json");

export const getSurvivalTime = (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(outputPath, "utf-8"));
    const surv = data.survival_timer_model || {};

    // Emit to all connected clients
    req.io.emit("survival_update", {
      survival_time_seconds: surv.estimated_survival_time_sec || null,
      confidence_survival: surv.confidence || null,
      alert_level: surv.alert_level || "normal",
    });

    res.status(200).json({
      success: true,
      message: "Survival time emitted via socket",
      survival_time_seconds: surv.estimated_survival_time_sec || null,
    });
  } catch (err) {
    console.error("❌ Error reading output.json:", err);
    res.status(500).json({ success: false, message: "Error reading ML output" });
  }
};
