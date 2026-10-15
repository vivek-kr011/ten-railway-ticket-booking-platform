/* optimization */

/* 
    ((621 - 228) / 621) * 100 = 63.28%
*/

const mongoose = require("mongoose");
const Schedule = require("../models/Schedule");
const Train = require("../models/Train");
const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/; // ->CPU Optimization

module.exports.createSchedule = async (req, res, next) => {
  try {
    const { train, journeyDate, departureTime, arrivalTime } = req.body;

    if (!train || !journeyDate || !departureTime || !arrivalTime) {
      return res.status(400).json({
        message:
          "Train, journey date, departure time and arrival time are required.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(train)) {
      return res.status(400).json({
        message: "Invalid train ID.",
      });
    }

    // OPTIMIZATION 1: Use .exists() for a faster, lighter query
    const trainExists = await Train.exists({ _id: train });

    if (!trainExists) {
      return res.status(404).json({
        message: "Train not found.",
      });
    }

    const parsedJourneyDate = new Date(journeyDate);

    if (isNaN(parsedJourneyDate.getTime())) {
      return res.status(400).json({
        message: "Invalid journey date.",
      });
    }

    // const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/; // -> Put it outside the function

    if (!timeRegex.test(departureTime)) {
      return res.status(400).json({
        message: "Invalid departure time. Use HH:mm format.",
      });
    }

    if (!timeRegex.test(arrivalTime)) {
      return res.status(400).json({
        message: "Invalid arrival time. Use HH:mm format.",
      });
    }

    const newSchedule = new Schedule({
      train,
      journeyDate: parsedJourneyDate,
      departureTime,
      arrivalTime,
    });

    // OPTIMIZATION 2: Save directly, the database unique index handles duplicate checks.
    const savedSchedule = await newSchedule.save();

    return res.status(201).json({
      message: "Schedule created successfully.",
      schedule: savedSchedule,
    });
  } catch (error) {
    // OPTIMIZATION 3: Catch the MongoDB duplicate key error code (11000)
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Schedule already exists for this train and date.",
      });
    }

    console.log(error);
    next(error);
  }
};

module.exports.getSchedules = async (req, res, next) => {
  try {
    const { journeyDate } = req.query;

    // Journey date required
    if (!journeyDate) {
      return res.status(400).json({
        message: "Journey date is required.",
      });
    }

    // Validate journey date
    const parsedJourneyDate = new Date(journeyDate);

    if (isNaN(parsedJourneyDate.getTime())) {
      return res.status(400).json({
        message: "Invalid journey date.",
      });
    }

    // Start of the journey date
    const startOfDay = new Date(parsedJourneyDate);
    startOfDay.setHours(0, 0, 0, 0);

    // End of the journey date
    const endOfDay = new Date(parsedJourneyDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Find schedules for the given date
    const schedules = await Schedule.find({
      journeyDate: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    }).populate("train");

    // No schedules found
    if (schedules.length === 0) {
      return res.status(404).json({
        message: "No schedules found for the given journey date.",
      });
    }

    return res.status(200).json({
      message: "Schedules fetched successfully.",
      schedules,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports.getSingleSchedules = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid schedule ID.",
      });
    }

    const schedule = await Schedule.findById(id).populate("train");

    if (!schedule) {
      return res.status(404).json({
        message: "Schedule not found.",
      });
    }

    return res.status(200).json({
      message: "Schedule fetched successfully.",
      schedule,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports.updateSchedule = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { journeyDate, departureTime, arrivalTime, status } = req.body;

    // 1. Validate Schedule ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid schedule ID.",
      });
    }

    // 2. Find existing schedule
    const existingSchedule = await Schedule.findById(id);

    if (!existingSchedule) {
      return res.status(404).json({
        message: "Schedule not found.",
      });
    }

    // 3. Check whether any field is provided
    if (
      journeyDate === undefined &&
      departureTime === undefined &&
      arrivalTime === undefined &&
      status === undefined
    ) {
      return res.status(400).json({
        message: "No fields provided for update.",
      });
    }

    // 4. Validate journey date
    let updatedJourneyDate = existingSchedule.journeyDate;

    if (journeyDate !== undefined) {
      const parsedJourneyDate = new Date(journeyDate);

      if (isNaN(parsedJourneyDate.getTime())) {
        return res.status(400).json({
          message: "Invalid journey date.",
        });
      }

      updatedJourneyDate = parsedJourneyDate;
    }

    // 5. Validate departure time
    if (departureTime !== undefined) {
      if (!timeRegex.test(departureTime)) {
        return res.status(400).json({
          message: "Invalid departure time. Use HH:mm format.",
        });
      }
    }

    // 6. Validate arrival time
    if (arrivalTime !== undefined) {
      if (!timeRegex.test(arrivalTime)) {
        return res.status(400).json({
          message: "Invalid arrival time. Use HH:mm format.",
        });
      }
    }

    // 7. Validate status
    if (status !== undefined) {
      if (!["AVAILABLE", "CANCELLED"].includes(status)) {
        return res.status(400).json({
          message: "Invalid schedule status.",
        });
      }
    }

    // 8. Check duplicate schedule
    const existingDuplicate = await Schedule.findOne({
      train: existingSchedule.train,
      journeyDate: updatedJourneyDate,
      _id: { $ne: id },
    });

    if (existingDuplicate) {
      return res.status(409).json({
        message: "A schedule already exists for this train and journey date.",
      });
    }

    // 9. Update fields
    existingSchedule.journeyDate = updatedJourneyDate;

    if (departureTime !== undefined) {
      existingSchedule.departureTime = departureTime;
    }

    if (arrivalTime !== undefined) {
      existingSchedule.arrivalTime = arrivalTime;
    }

    if (status !== undefined) {
      existingSchedule.status = status;
    }

    // 10. Save updated schedule
    const updatedSchedule = await existingSchedule.save();

    // 11. Response
    return res.status(200).json({
      message: "Schedule updated successfully.",
      schedule: updatedSchedule,
    });

  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports.deleteSchedule = async(req, res, next) => {

  try {

    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid schedule ID.",
      });
    }

    const existingSchedule = await Schedule.findByIdAndDelete(id);
    
    if(!existingSchedule) {
      return res.status(404).json({
        message: "Schedule not found.",
      });
    }

    return res.status(200).json({
      message: "Schedule deleted successfully.",
      schedule: existingSchedule,
    })

  } catch (error) {
    console.log(error);
    next(error);
  }
}