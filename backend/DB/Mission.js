import mongoose from "mongoose";

const alertSchema = new mongoose.Schema({
  type: String,
  level: String,
  message: String,
});

const missionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  location: String,
  nodes: [String],
  alerts: [alertSchema],
  createdBy: { type: String, required: true },
});

export default mongoose.model("Mission", missionSchema);
