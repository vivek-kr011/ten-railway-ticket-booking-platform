const mongoose = require("mongoose");
const Train = require("../models/Train");
const Station = require("../models/Station");
const Schedule = require("../models/Schedule");

module.exports.createTrain = async (req, res, next) => {
  try {
    const { trainNumber, trainName, source, destination, classes } = req.body;

    if (
      !trainNumber ||
      !trainName ||
      !source ||
      !destination ||
      !Array.isArray(classes) ||
      classes.length === 0
    ) {
      return res.status(400).json({
        message:
          "Train number, train name, source, destination and classes are required.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(source)) {
      return res.status(400).json({
        message: "Invalid source station ID.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(destination)) {
      return res.status(400).json({
        message: "Invalid destination station ID.",
      });
    }

    if (source === destination) {
      return res
        .status(400)
        .json({ message: "Source and destination cannot be the same." });
    }

    const sourceStation = await Station.findById(source);

    if (!sourceStation) {
      return res.status(404).json({ message: "Source station not found." });
    }

    const destinationStation = await Station.findById(destination);

    if (!destinationStation) {
      return res
        .status(404)
        .json({ message: "Destination station not found." });
    }

    const existingTrain = await Train.findOne({ trainNumber });

    if (existingTrain) {
      return res.status(409).json({
        message: "Train number already exists.",
      });
    }

    const newTrain = new Train({
      trainNumber,
      trainName,
      source,
      destination,
      classes,
    });

    const savedTrain = await newTrain.save();

    return res.status(201).json({
      message: "Train created successfully.",
      train: savedTrain,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports.getTrains = async (req, res, next) => {
  try {
    const { source, destination } = req.query;

    if (!source || !destination) {
      return res.status(400).json({
        message: "Source and destination are required.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(source)) {
      return res.status(400).json({
        message: "Invalid source station ID.",
      });
    }
    if (!mongoose.Types.ObjectId.isValid(destination)) {
      return res.status(400).json({
        message: "Invalid destination station ID.",
      });
    }

    if (source === destination) {
      return res.status(400).json({
        message: "Source and destination cannot be the same.",
      });
    }

    const sourceStation = await Station.findById(source);

    if (!sourceStation) {
      return res.status(404).json({
        message: "Source station not found.",
      });
    }

    const destinationStation = await Station.findById(destination);

    if (!destinationStation) {
      return res.status(404).json({
        message: "Destination station not found.",
      });
    }

    const trains = await Train.find({ source, destination })
      .populate("source")
      .populate("destination");

    if (trains.length === 0) {
      return res.status(404).json({
        message: "No trains found for the given source and destination.",
      });
    }

    return res.status(200).json({
      message: "Trains fetched successfully",
      trains,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports.getSingleTrain = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid train ID.",
      });
    }

    const train = await Train.findById(id)
      .populate("source")
      .populate("destination");

    if (!train) {
      return res.status(404).json({
        message: "Train not found.",
      });
    }

    return res.status(200).json({
      message: "Train fetched successfully.",
      train,
    });
  } catch (error) {
    console.log(error);

    next(error);
  }
};

module.exports.updateTrain = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { trainNumber, trainName, source, destination, classes } = req.body;

    if (
      !trainNumber ||
      !trainName ||
      !source ||
      !destination ||
      !Array.isArray(classes) ||
      classes.length === 0
    ) {
      return res.status(400).json({
        message:
          "Train number, train name, source, destination and classes are required.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid train ID.",
      });
    }

    const train = await Train.findById(id);

    if (!train) {
      return res.status(404).json({
        message: "Train not found.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(source)) {
      return res.status(400).json({
        message: "Invalid source station ID.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(destination)) {
      return res.status(400).json({
        message: "Invalid destination station ID.",
      });
    }

    if (source === destination) {
      return res.status(400).json({
        message: "Source and destination cannot be the same.",
      });
    }

    const sourceStation = await Station.findById(source);

    if (!sourceStation) {
      return res.status(404).json({
        message: "Source station not found.",
      });
    }

    const destinationStation = await Station.findById(destination);

    if (!destinationStation) {
      return res.status(404).json({
        message: "Destination station not found.",
      });
    }

    const existingTrain = await Train.findOne({
      trainNumber,
      _id: { $ne: id },
    });

    if (existingTrain) {
      return res.status(409).json({
        message: "Train number already exists.",
      });
    }

    // update train
    train.trainNumber = trainNumber;
    train.trainName = trainName;
    train.source = source;
    train.destination = destination;
    train.classes = classes;

    const updatedTrain = await train.save();

    return res.status(200).json({
      message: "Train updated successfully.",
      train: updatedTrain,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports.deleteTrain = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid Train ID.",
      });
    }

    /* For the optimization I comment this codde ( DataBase query 2 times ) */

    // const existingTrain = await Train.findById(id);

    // if(!existingTrain) {
    //   return res.status(404).json({
    //     message: "Train not found.",
    //   });
    // }

    const deletedTrain = await Train.findByIdAndDelete(id);

    if (!deletedTrain) {
      return res.status(404).json({
        message: "Train not found.",
      });
    }

    return res.status(200).json({
      message: "Train deleted successfully.",
      train: deletedTrain,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports.searchTrains = async (req, res) => {
  try {
    const { source, destination, journeyDate } = req.query;

    if (!source || !destination || !journeyDate) {
      return res.status(400).json({
        message: "Source, destination and journey date are required.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(source)) {
      return res.status(400).json({ message: "Invalid source station ID." });
    }

    if (!mongoose.Types.ObjectId.isValid(destination)) {
      return res
        .status(400)
        .json({ message: "Invalid destination station ID." });
    }

    if (source === destination) {
      return res.status(400).json({
        message: "Source and destination cannot be the same.",
      });
    }

    const parsedDate = new Date(journeyDate);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ message: "Invalid journey date." });
    }

    const sourceStationExists = await Station.findById(source);
    if (!sourceStationExists) {
      return res.status(404).json({ message: "Source station not found." });
    }

    const destinationStationExists = await Station.findById(destination);
    if (!destinationStationExists) {
      return res
        .status(404)
        .json({ message: "Destination station not found." });
    }

    const matchingTrains = await Train.find({
      source: source,
      destination: destination,
    });

    if (!matchingTrains || matchingTrains.length === 0) {
      return res
        .status(404)
        .json({ message: "No trains found for this route." });
    }

    const trainIds = matchingTrains.map((train) => train._id);

    const startOfDay = new Date(parsedDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(parsedDate.setHours(23, 59, 59, 999));

    // const matchingSchedules = await Schedule.find({
    //   train: { $in: trainIds },
    //   journeyDate: { $gte: startOfDay, $lte: endOfDay },
    //   status: "AVAILABLE",
    // }).populate("train");

    const matchingSchedules = await Schedule.find({
      train: { $in: trainIds },
      journeyDate: { $gte: startOfDay, $lte: endOfDay },
      status: "AVAILABLE",
    }).populate({
      path: "train",
      populate: [
        {
          path: "source",
        },
        {
          path: "destination",
        },
      ],
    });

    if (!matchingSchedules || matchingSchedules.length === 0) {
      return res
        .status(404)
        .json({ message: "No trains available for the selected date." });
    }

    // const results = matchingSchedules.map((schedule) => ({
    //   train: schedule.train,
    //   schedule: {
    //     _id: schedule._id,
    //     journeyDate: schedule.journeyDate,
    //     status: schedule.status,
    //   },
    // }));

    const results = matchingSchedules.map((schedule) => ({
      train: schedule.train,

      schedule: {
        _id: schedule._id,
        journeyDate: schedule.journeyDate,
        departureTime: schedule.departureTime,
        arrivalTime: schedule.arrivalTime,
        status: schedule.status,
      },
    }));

    return res.status(200).json({
      message: "Trains fetched successfully.",
      results: results,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};
