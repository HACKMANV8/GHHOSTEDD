import express from "express";
const router = express.Router();


//reuquired files


// Example POST route for loc
router.post("/loc", (req, res) => {
     res.status(200).json({ success: true, message: "Message sent via socket" });
});
router.get("/gaslevel", (req, res) => {
        res.send("GAS LEVEL ROUTE WORKING FINE");
});
router.get("/heatmap", (req, res) => {
        res.send("SMOKE LEVEL ROUTE WORKING FINE");
});

export default router;
