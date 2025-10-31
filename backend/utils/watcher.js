import fs from "fs";
import path from "path";

const outputPath = path.resolve("./models/output.json");

export const setupWatcher = (io) => {
  console.log("👀 Watching ML model output file...");

  fs.watchFile(outputPath, { interval: 1000 }, () => {
    try {
      const raw = fs.readFileSync(outputPath, "utf8");
      const data = JSON.parse(raw);

      const envStatus = data.environment_status;
      const survivalTime = data.survival_time;

      // Emit environment status to all clients
      io.emit("env_update", { environment_status: envStatus });
      console.log("🌍 Emitted environment status:", envStatus);

      // Emit survival time only if danger
      if (envStatus === "danger") {
        io.emit("survival_time", { survival_time: survivalTime });
        console.log("⚠️ Emitted survival time:", survivalTime);

        // Auto stop after survival time
        setTimeout(() => {
          io.emit("survival_end", { message: "Survival time ended" });
          console.log("⏹️ Survival time ended — emission stopped.");
        }, survivalTime * 1000);
      }
    } catch (err) {
      console.error("❌ Error reading output.json:", err.message);
    }
  });
};
