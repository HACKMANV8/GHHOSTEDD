import Mission from "../DB/Mission.js";
import Node from "../DB/Node.js";

export const createMission = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can create missions" });
    }

    const { name, description, location, nodeIds } = req.body;

    const mission = new Mission({
      name,
      description,
      location,
      nodes: nodeIds,
      createdBy: req.user.id,
    });

    await mission.save();
    res.status(201).json({ success: true, mission });
  } catch (err) {
    res.status(500).json({ message: "Error creating mission" });
  }
};

export const getMyMissions = async (req, res) => {
  try {
    const missions = await Mission.find({ createdBy: req.user.id })
      .populate("nodes", "name status location");
    res.status(200).json({ success: true, missions });
  } catch (err) {
    res.status(500).json({ message: "Error fetching missions" });
  }
};
