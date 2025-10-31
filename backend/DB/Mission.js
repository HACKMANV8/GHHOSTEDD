import mongoose from "mongoose";

const missionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  location: String,
  nodes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Node" }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Mission", missionSchema);
