import mongoose from "mongoose";

const nodeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  location: { type: String },
});

export default mongoose.model("Node", nodeSchema);
