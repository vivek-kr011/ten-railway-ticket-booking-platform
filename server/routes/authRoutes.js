const express = require("express");
const router = express.Router();

const { signup, login, getCurrentUser } = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");


// Register User
router.post("/register", signup);
router.post("/login", login);

router.get("/me", authMiddleware, getCurrentUser);


module.exports = router;