const mongoose = require("mongoose");
const Train = require("../models/Train");
const Schedule = require("../models/Schedule");
const Booking = require("../models/Booking");

const badRequest = (res, message) =>
  res.status(400).json({ message });

module.exports.createBooking = async (req, res, next) => {
  try {
    const { trainId, scheduleId, classType, passengers } = req.body;
    const userId = req.user._id;

    // Required fields
    if (!trainId || !scheduleId || !classType || !passengers) {
      return badRequest(
        res,
        "Train, schedule, class type and passengers are required."
      );
    }

    // Validate IDs
    if (!mongoose.Types.ObjectId.isValid(trainId)) {
      return badRequest(res, "Invalid train ID.");
    }

    if (!mongoose.Types.ObjectId.isValid(scheduleId)) {
      return badRequest(res, "Invalid schedule ID.");
    }

    // Find train and schedule
    const [train, schedule] = await Promise.all([
      Train.findById(trainId),
      Schedule.findById(scheduleId),
    ]);

    if (!train) {
      return res.status(404).json({
        message: "Train not found.",
      });
    }

    if (!schedule) {
      return res.status(404).json({
        message: "Schedule not found.",
      });
    }

    // Validate schedule
    if (schedule.train.toString() !== trainId) {
      return badRequest(
        res,
        "Schedule does not belong to this train."
      );
    }

    if (schedule.status !== "AVAILABLE") {
      return badRequest(
        res,
        "Schedule is not available for booking."
      );
    }

    // Validate class
    const selectedClass = train.classes.find(
      (item) => item.classType === classType
    );

    if (!selectedClass) {
      return badRequest(
        res,
        "Selected class is not available on this train."
      );
    }

    // Validate passengers
    if (!Array.isArray(passengers) || passengers.length === 0) {
      return badRequest(
        res,
        "At least one passenger is required."
      );
    }

    const invalidPassenger = passengers.find(
      (passenger) =>
        !passenger.name ||
        passenger.age == null ||
        passenger.age <= 0 ||
        !["MALE", "FEMALE", "OTHER"].includes(passenger.gender)
    );

    if (invalidPassenger) {
      return badRequest(
        res,
        "Invalid passenger details."
      );
    }

    // Seat availability
    const bookings = await Booking.find({
      schedule: scheduleId,
      classType,
      bookingStatus: { $ne: "CANCELLED" },
    }).select("passengers");

    const bookedSeats = bookings.reduce(
      (total, booking) => total + booking.passengers.length,
      0
    );

    const requiredSeats = passengers.length;
    const availableSeats =
      selectedClass.totalSeats - bookedSeats;

    if (requiredSeats > availableSeats) {
      return badRequest(
        res,
        "Not enough seats available."
      );
    }

    // Fare
    const totalFare =
      selectedClass.fare * requiredSeats;

    // Unique PNR
    let pnr;

    do {
      pnr = Math.floor(
        1000000000 + Math.random() * 9000000000
      ).toString();
    } while (await Booking.exists({ pnr }));

    // Create booking
    const booking = await Booking.create({
      user: userId,
      train: trainId,
      schedule: scheduleId,
      classType,
      passengers,
      totalFare,
      pnr,
    });

    return res.status(201).json({
      message: "Booking created successfully.",
      booking,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports.getMyBookings = async(req, res, next) => {

  try {

    const userId = req.user._id;

    /* Find user Booking */
    const bookings = await Booking.find({
      user: userId
    })
    .populate("train")
    .populate("schedule");

    if(bookings.length === 0) {
      return res.status(200).json({
        message: "No bookings found.",
        bookings: [],
      });
    }

    return res.status(200).json({
      message: "Bookings fetched successfully.",
      bookings,
    })


  } catch (error) {
    console.log(error);
    next(error);

  }
};


module.exports.getSingleBooking = async(req, res, next) => {

  try {

    // const bookingId = req.params;

    const { id } = req.params;

    const userId = req.user._id;

    if(!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid booking ID."
      });
    }

    const booking = await Booking.findById(id)
      .populate("train")
      .populate("schedule");

    if(!booking){
      return res.status(404).json({
        message: "Booking not found.",
      });
    }

    if(booking.user.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "You are not authorized to access this booking.",
      })
    }
    
    
    return res.status(200).json({
      message: "Booking fetched successfully",
      booking,
    })


  } catch (error) {
    console.log(error);
    next(error);
  }
};


module.exports.cancelBooking = async(req, res, next) => {

  try {

    const { id } = req.params;

    const userId = req.user._id;

    if(!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid booking ID.",
      });
    }

    const booking = await Booking.findById(id);

    if(!booking) {
      return res.status(404).json({
        message: "Booking not found.",
      });
    }

    if(booking.user.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "You are not authorized to cancel this booking.",
      });
    }

    if(booking.bookingStatus === "CANCELLED") {
      return res.status(400).json({
        message: "Booking is already cancelled."
      });
    }


    booking.bookingStatus = "CANCELLED";

    // save booking
    await booking.save();

    return res.status(200).json({
      message: "Booking cancelled successfully.",
      booking,
    });


  } catch (error) {
    console.log(error);
    next(error);
  }
}
