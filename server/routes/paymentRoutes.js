const express = require("express");
const router = express.Router();

const middleware = require("../middleware/authMiddleware");

const {
  createPayment,
  processPayment,
  getMyPayments,
  getSinglePayment,
} = require("../controllers/paymentController");

router.post("/", middleware, createPayment);
router.post("/process", middleware, processPayment);
router.get("/", middleware, getMyPayments);
router.get("/:paymentId", middleware, getSinglePayment);

module.exports = router;
