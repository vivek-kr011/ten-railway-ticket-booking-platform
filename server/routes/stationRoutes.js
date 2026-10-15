const express = require("express");
const router = express.Router();

const {
  createStation,
  getStations,
  getSingleStation,
  updateStation,
  deleteStation
} = require("../controllers/stationController");

router.post("/", createStation);
router.get("/", getStations);
router.get("/:id", getSingleStation);
router.put("/:id", updateStation);
router.delete("/:id", deleteStation);

module.exports = router;
