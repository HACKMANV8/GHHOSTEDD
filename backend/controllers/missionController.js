// backend/controllers/missionController.js
import Mission from "../DB/Mission.js";

export const createMission = async (req, res) => {
  try {
    const { name, nodes } = req.body;
    const userId = req.user.id;

    const mission = await Mission.create({
      name,
      nodes,
      createdBy: userId,
    });

    res.status(201).json({
      success: true,
      message: "Mission created successfully",
      mission,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Fetch missions depending on user role
export const getMyMissions = async (req, res) => {
  try {
    const { id, role } = req.user;
    let missions;

    if (role === "admin") {
      // Admins can view all missions
      missions = await Mission.find().populate("createdBy", "username role");
    } else {
      // Normal users can only see their own
      missions = await Mission.find({ createdBy: id });
    }

    res.status(200).json({
      success: true,
      count: missions.length,
      missions,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
