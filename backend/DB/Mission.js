import mongoose from "mongoose";

const missionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  location: { type: String },
  nodes: [
    {
      type: String, // or mongoose.Schema.Types.ObjectId if you have a separate Node model
      required: true,
    },
  ],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Mission", missionSchema);
