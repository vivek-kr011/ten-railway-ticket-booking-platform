const mongoose = require("mongoose");

const User = require("../models/User");
const Train = require("../models/Train");
const Station = require("../models/Station");
const Schedule = require("../models/Schedule");
const Booking = require("../models/Booking");
const Payment = require("../models/Payment");

module.exports.getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.estimatedDocumentCount();
    const totalTrains = await Train.estimatedDocumentCount();
    const totalSchedules = await Schedule.estimatedDocumentCount();
    const totalBookings = await Booking.estimatedDocumentCount();
    const totalPayments = await Payment.estimatedDocumentCount();

    return res.status(200).json({
      message: "Dashboard statistics fetched successfully",

      data: {
        totalUsers: totalUsers,
        totalTrains: totalTrains,
        totalSchedules: totalSchedules,
        totalBookings: totalBookings,
        totalPayments: totalPayments,
      },
    });
  } catch (error) {
    console.log(error);

    next(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports.addTrain = async (req, res, next) => {
  try {
    const { trainNumber, trainName, source, destination, classes } = req.body;

    // 1. Required fields
    if (!trainNumber || !trainName || !source || !destination || !classes) {
      return res.status(400).json({
        message: "Required fields are missing.",
      });
    }

    // 2. Validate station IDs
    if (
      !mongoose.Types.ObjectId.isValid(source) ||
      !mongoose.Types.ObjectId.isValid(destination)
    ) {
      return res.status(400).json({
        message: "Invalid source or destination station ID.",
      });
    }

    // 3. Source and destination cannot be same
    if (source.toString() === destination.toString()) {
      return res.status(400).json({
        message: "Source and destination cannot be same.",
      });
    }

    // 4. Check source station
    const sourceStation = await Station.findById(source);

    if (!sourceStation) {
      return res.status(404).json({
        message: "Source station not found.",
      });
    }

    // 5. Check destination station
    const destinationStation = await Station.findById(destination);

    if (!destinationStation) {
      return res.status(404).json({
        message: "Destination station not found.",
      });
    }

    // 6. Check duplicate train
    const existingTrain = await Train.findOne({
      trainNumber,
    });

    if (existingTrain) {
      return res.status(400).json({
        message: "Train already exists.",
      });
    }

    // 7. Validate classes
    if (!Array.isArray(classes) || classes.length === 0) {
      return res.status(400).json({
        message: "At least one train class is required.",
      });
    }

    for (const trainClass of classes) {
      if (
        !trainClass.classType ||
        trainClass.fare === undefined ||
        trainClass.totalSeats === undefined
      ) {
        return res.status(400).json({
          message: "Invalid train class data.",
        });
      }

      if (trainClass.fare <= 0 || trainClass.totalSeats <= 0) {
        return res.status(400).json({
          message: "Fare and total seats must be greater than 0.",
        });
      }
    }

    // 8. Create train
    const train = await Train.create({
      trainNumber,
      trainName,
      source,
      destination,
      classes,
    });

    // 9. Response
    return res.status(201).json({
      message: "Train created successfully.",
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

    const { trainName, trainNumber, source, destination, classes } = req.body;

    // if (!trainName || !trainNumber || !source || !destination || !classType) {
    //     return res.status(400).json({
    //         message: "Required fields are missing."
    //     })
    // }

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

    // Check at least one field
    if (
      trainNumber === undefined &&
      trainName === undefined &&
      source === undefined &&
      destination === undefined &&
      classes === undefined
    ) {
      return res.status(400).json({
        message: "No fields provided for update.",
      });
    }

    // Validate train number
    if (trainNumber !== undefined) {
      const existingTrain = await Train.findOne({
        trainNumber,
        _id: { $ne: id },
      });

      if (existingTrain) {
        return res.status(400).json({
          message: "Train number already exists.",
        });
      }

      train.trainNumber = trainNumber;
    }

    // Update train name
    if (trainName !== undefined) {
      if (!trainName.trim()) {
        return res.status(400).json({
          message: "Train name cannot be empty.",
        });
      }

      train.trainName = trainName;
    }

    // validate source
    if (source !== undefined) {
      if (!mongoose.Types.ObjectId.isValid(source)) {
        return res.status(400).json({
          message: "Invalid source station ID.",
        });
      }

      const sourceStation = await Station.findById(source);

      if (!sourceStation) {
        return res.status(404).json({
          message: "Source station not found.",
        });
      }

      train.source = source;
    }

    // validate destination
    if (destination !== undefined) {
      if (!mongoose.Types.ObjectId.isValid(destination)) {
        return res.status(400).json({
          message: "Invalid destinaiton station ID.",
        });
      }

      const destinationStation = await Station.findById(destination);

      if (!destinationStation) {
        return res.status(404).json({
          message: "Destination station not found.",
        });
      }

      train.destination = destination;
    }

    // sourcce and destination cannot be same
    const finalSource = train.source.toString();
    const finalDestination = train.destination.toString();

    if (finalSource === finalDestination) {
      return res.status(400).json({
        message: "Source and Destination cannot be same.",
      });
    }

    // validate classes
    if (classes !== undefined) {
      if (!Array.isArray(classes) || classes.length === 0) {
        return res.status(400).json({
          mesage: "At least one train class is required.",
        });
      }

      for (const trainClass of classes) {
        if (
          !trainClass.classType ||
          trainClass.fare === undefined ||
          trainClass.totalSeats === undefined
        ) {
          return res.status(400).json({
            messge: "Invalid train class data.",
          });
        }

        if (trainClass.fare <= 0 || trainClass.totalSeats <= 0) {
          return res.status(400).json({
            message: "Fare and total seats must be greater than 0.",
          });
        }
      }

      train.classes = classes;
    }

    await train.save();

    return res.status(200).json({
      message: "Train updated successfully.",
      train,
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
        message: "Invalid train id.",
      });
    }

    const train = await Train.findById(id);

    if (!train) {
      return res.status(404).json({
        message: "Train not found.",
      });
    }

    const deletedTrain = await Train.findByIdAndDelete(id);

    console.log(deletedTrain);

    return res.status(200).json({
      message: "Train deleted successfully.",
      train: deletedTrain,
    });
  } catch (error) {
    console.log(error);

    next(error);
  }
};

module.exports.getAllTrains = async (req, res, next) => {
  try {
    const trains = await Train.find()
      .populate("source")
      .populate("destination");

    res.status(200).json({
      message: "All trains fetched successfully.",
      trains,
    });
  } catch (error) {
    console.error("Error fetching all trains:", error);

    next(error);
  }
};

module.exports.getAllBookings = async (req, res, next) => {
  try {
    const { status } = req.query;

    const filter = {};

    // Optional booking status filter
    if (status !== undefined) {
      if (!["PENDING", "CONFIRMED", "CANCELLED"].includes(status)) {
        return res.status(400).json({
          message: "Invalid booking status.",
        });
      }

      filter.bookingStatus = status;
    }

    // Fetch all bookings
    const bookings = await Booking.find(filter)
      .populate("user", "name email phone")
      .populate("train")
      .populate("schedule");

    // No bookings found
    if (bookings.length === 0) {
      return res.status(200).json({
        message: "No bookings found.",
        bookings: [],
      });
    }

    return res.status(200).json({
      message: "All bookings fetched successfully.",
      bookings,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
