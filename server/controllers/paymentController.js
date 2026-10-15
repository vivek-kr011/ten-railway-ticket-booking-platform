const mongoose = require("mongoose");
const Payment = require("../models/Payment");
const Booking = require("../models/Booking");

module.exports.createPayment = async (req, res, next) => {
  try {
    const { bookingId, paymentMethod } = req.body;

    const userId = req.user._id; // logged-in userId.

    // check required fields
    if (!bookingId || !paymentMethod) {
      return res.status(400).json({
        message: "Required fields are missing.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({
        message: "Invalid booking Id.",
      });
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found.",
      });
    }

    if (booking.user.toString() != userId.toString()) {
      return res.status(403).json({
        message: "You are not authorized to make payment for this booking.",
      });
    }

    if (booking.bookingStatus === "CANCELLED") {
      return res.status(400).json({
        message: "Booking is cancelled",
      });
    }

    const existingPayment = await Payment.findOne({
      booking: bookingId,
      status: "SUCCESS",
    });

    if (existingPayment) {
      return res.status(400).json({
        message: "Booking is already paid.",
      });
    }

    // validate paymentMethod
    if (!["CARD", "UPI", "NET_BANKING"].includes(paymentMethod)) {
      return res.status(400).json({
        message: "Invalid payment method.",
      });
    }

    // Generate Unique Transaction ID... ?
    let transactionId;
    let existingTransaction;

    do {
      transactionId = "TXN" + Date.now() + Math.floor(Math.random() * 10000);

      existingTransaction = await Payment.findOne({
        transactionId,
      });
    } while (existingTransaction);

    // create Payment
    const payment = await Payment.create({
      booking: bookingId,
      user: userId,
      amount: booking.totalFare,
      paymentMethod,
      transactionId,
    });

    return res.status(201).json({
      message: "Payment initiated successfully.",
      payment,
    });

  } catch (error) {
    console.log(error);
    next(error);
  }

};                  

module.exports.processPayment = async (req, res, next) => {

    try {

        const { paymentId, result } = req.body;

        const userId = req.user._id;

        if (!paymentId) {
            return res.status(400).json({
                message: "Payment ID is required.",
            });
        }

        if (!mongoose.Types.ObjectId.isValid(paymentId)) {
            return res.status(400).json({
                message: "Invalid payment ID.",
            });
            
        }

        const payment = await Payment.findById(paymentId);
        
        if (!payment) {
            return res.status(404).json({
                message: "Payment not found.",
            });
        }

        if (payment.user.toString() !== userId.toString()) {
            return res.status(403).json({
                message: "You are not authorized to process this payment."
            });
        }   
        
        // Result validate

        if (!["SUCCESS", "FAILED"].includes(result)) {
                return res.status(400).json({
                    message: "Invalid payment result.",
            });
        }

        if (payment.status !== "PENDING") {
            return res.status(400).json({
                message: "Payment has already been processed.",
            });
        }

        const booking = await Booking.findById(payment.booking);

        if(!booking) {
            return res.status(404).json({
                message: "Booking not found.",
            });
        }

        if (booking.bookingStatus === "CANCELLED") {
            return res.status(400).json({
                message: "Booking is already cancelled.",
            });
        }

        if (payment.amount !== booking.totalFare) {
            return res.status(400).json({
                message: "Payment amount does not match booking fare.",
            });
        }

        // payment.status = "SUCCESS"

        // await payment.save();

        // booking.paymentStatus = "PAID";
        // booking.bookingStatus = "CONFIRMED";

        // await booking.save();

        if (result === "SUCCESS") {
            payment.status = "SUCCESS";

            booking.paymentStatus = "PAID";
            booking.bookingStatus = "CONFIRMED";
        }

        if (result === "FAILED") {
            payment.status = "FAILED";
            booking.paymentStatus = "FAILED";
        }

        await payment.save();
        await booking.save();

        return res.status(200).json({
            message: "Payment processed successfully.",
            payment,
            booking,
        })

    } catch (error) {
        console.log(error);
        next(error);
    }
}


/* Get all Payments of logged-in user */
module.exports.getMyPayments = async (req, res, next) => {

    try {

        const userId = req.user._id;

        const payments = await Payment.find({
            user: userId,
        })
        .populate("booking");

        if (payments.length === 0) {
            return res.status(200).json({
                message: "No payments found.",
                payments: [],
            });
        }

        return res.status(200).json({
            message: "Payments fetched successfully.",
            payments,
        });

    } catch (error) {
        console.log(error);
        next(error);
    }
}

/* A single specific payment of logged-in User */
module.exports.getSinglePayment = async (req, res, next) => {

    try {

        const userId = req.user._id;

        const { paymentId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(paymentId)) {
            return res.status(400).json({
                message: "Invalid payment ID.",
            });
            
        }

        const singlePayment = await Payment.findById(paymentId).populate("booking");

        if(!singlePayment) {
            return res.status(404).json({
                message: "Payment not found.",
            });
        }

        if(singlePayment.user.toString() !== userId.toString()) {
            return res.status(403).json({
                message: "You are not authorized to access this payment",
            });
        }

        return res.status(200).json({
            message: "Single payment successfully fetched.",
            payment: singlePayment,
        });


    } catch (error) {
        console.log(error);
        next(error);
    }
}