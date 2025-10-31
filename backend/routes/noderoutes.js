import express from "express";
import { sendHeatmapData } from "../controllers/heatmapandloc.js";
import { getEnvStatus } from "../controllers/envController.js";
import { getSurvivalTime } from "../controllers/survivalController.js";

export default (io) => {
    const router = express.Router();

    //heatmap route
    router.get("/heatmap", (req, res) => {
        if (!io.heatmapInterval) {
            io.heatmapInterval = setInterval(() => {
                sendHeatmapData(io);
            }, 200000);
            console.log("📡 Heatmap broadcast started (every 2 seconds)");
        }

        res.status(200).json({ success: true, message: "Heatmap streaming started" });
    });



    router.get("/gaslevel", (req, res) => {
        res.send("GAS LEVEL ROUTE WORKING FINE");
    });

    router.get("/loc", (req, res) => {
        res.status(200).json({ success: true, message: "Location received",loc:'12.908921, 77.566399'});
    });



    router.use((req, res, next) => {
    req.io = io;
    next();
  });
    router.get("/survivalt",getSurvivalTime);
    router.get("/envstatus",getEnvStatus);

    return router;
};
