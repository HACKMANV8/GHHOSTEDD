import Mission from "../DB/Mission.js";

// 🛰️ Create a new mission
export const createMission = async (req, res) => {
  try {
    const { name, description, location, nodes } = req.body;
    const userId = req.user?.id || "dummyUser123"; // fallback for testing

    const mission = new Mission({
      name,
      description,
      location,
      nodes,
      createdBy: userId,
      alerts: [
        { type: "Temperature Spike", level: "High", message: "Node-1 overheating" },
        { type: "Low Battery", level: "Medium", message: "Node-3 battery below 40%" },
      ],
    });

    await mission.save();

    res.status(201).json({
      success: true,
      message: "Mission created successfully",
      mission,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📋 Get all missions of the logged-in user
export const getMyMissions = async (req, res) => {
  try {
    const userId = req.user?.id || "dummyUser123";
    const missions = await Mission.find({ createdBy: userId });

    res.status(200).json({
      success: true,
      count: missions.length,
      missions,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🌍 Get mission details (with hardcoded + real-time node info)
export const getMissionDetails = async (req, res) => {
  try {
    const mission = await Mission.findById(req.params.id);
    if (!mission)
      return res.status(404).json({ success: false, message: "Mission not found" });

    const nodeData = [
      { nodeId: "Node-A", temperature: 26.3, pH: 7.5, turbidity: 1.1, dissolvedOxygen: 8.2 },
      { nodeId: "Node-B", temperature: 24.9, pH: 7.2, turbidity: 0.9, dissolvedOxygen: 8.6 },
      { nodeId: "Node-C", temperature: 27.1, pH: 7.7, turbidity: 1.3, dissolvedOxygen: 7.9 },
      // This will be replaced by ML real-time node later
      { nodeId: "Node-RT", realTime: true },
    ];

    res.status(200).json({
      success: true,
      mission,
      nodes: nodeData,
      alerts: mission.alerts,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
