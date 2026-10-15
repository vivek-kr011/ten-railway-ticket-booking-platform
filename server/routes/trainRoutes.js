const express = require("express");
const router = express.Router();

const {createTrain, getTrains, getSingleTrain, updateTrain, deleteTrain, searchTrains} = require("../controllers/trainController");

router.post("/", createTrain);
router.get("/", getTrains);

router.get("/search", searchTrains);

router.get("/:id", getSingleTrain);
router.put("/:id", updateTrain);
router.delete("/:id", deleteTrain);



module.exports = router;