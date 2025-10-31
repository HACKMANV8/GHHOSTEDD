import mongoose from "mongoose";

const nodeSchema = new mongoose.Schema({
  name: String,
  status: String,
  location: String,
});

export default mongoose.model("Node", nodeSchema);
