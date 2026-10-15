const express = require("express");
const router = express.Router();

const middleware = require("../middleware/authMiddleware");

const {
  createBooking,
  getMyBookings,
  getSingleBooking,
  cancelBooking,
} = require("../controllers/bookingController");

router.post("/", middleware, createBooking);
router.get("/", middleware, getMyBookings);
router.get("/:id", middleware, getSingleBooking);
router.delete("/:id", middleware, cancelBooking)

module.exports = router;
