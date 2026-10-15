const express = require("express");
const router = express.Router();

const {
  createSchedule,
  getSchedules,
  getSingleSchedules,
  updateSchedule,
  deleteSchedule,
} = require("../controllers/scheduleController");

router.post("/", createSchedule);
router.get("/", getSchedules);
router.get("/:id", getSingleSchedules);
router.put("/:id", updateSchedule);
router.delete("/:id", deleteSchedule);

module.exports = router;
