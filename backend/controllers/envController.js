import fs from "fs";
import path from "path";

const outputPath = path.resolve("models/output.json");

export const getEnvStatus = (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(outputPath, "utf-8"));
    const env = data.env_status_model || {};

    // Emit to all connected clients
    req.io.emit("env_update", {
      environment_status: env.status || "unknown",
      confidence_env: env.confidence || null,
      temperature: env.temperature || null,
      humidity: env.humidity || null,
      air_quality_index: env.air_quality_index || null,
    });

    res.status(200).json({
      success: true,
      message: "Environment status emitted via socket",
      environment_status: env.status || "unknown",
    });
  } catch (err) {
    console.error("❌ Error reading output.json:", err);
    res.status(500).json({ success: false, message: "Error reading ML output" });
  }
};
