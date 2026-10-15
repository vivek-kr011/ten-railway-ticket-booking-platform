const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  getDashboardStats,
  addTrain,
  getAllTrains,
  updateTrain,
  deleteTrain,
  getAllBookings,
} = require("../controllers/adminController");

/* RE-USE of THIS CONTROLLER */
const {
  createSchedule,
  updateSchedule,
  deleteSchedule,
} = require("../controllers/scheduleController");

router.get("/test", authMiddleware, adminMiddleware, (req, res) => {
  res.status(200).json({
    message: "Admin access granted.",
  });
});

router.get("/dashboard", authMiddleware, adminMiddleware, getDashboardStats);

router.get("/trains", authMiddleware, adminMiddleware, getAllTrains);

router.post("/trains", authMiddleware, adminMiddleware, addTrain);

router.put("/trains/:id", authMiddleware, adminMiddleware, updateTrain);

router.delete("/trains/:id", authMiddleware, adminMiddleware, deleteTrain);

/* REUSE */
router.post("/schedules", authMiddleware, adminMiddleware, createSchedule);

router.put("/schedules/:id", authMiddleware, adminMiddleware, updateSchedule);

router.delete("/schedules/:id", authMiddleware, adminMiddleware, deleteSchedule);

/* BOOKING */
router.get("/bookings", authMiddleware, adminMiddleware, getAllBookings);

module.exports = router;
