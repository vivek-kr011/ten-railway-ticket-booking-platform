const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paymentSchema = new Schema(
    {
        booking: {
            type: Schema.Types.ObjectId,
            ref: "Booking",
            required: true,
        },

        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        amount: {
            type: Number,
            required: true,
        },

        paymentMethod: {
            type: String,
            enum: ["CARD", "UPI", "NET_BANKING"],
            required: true,
        },

        transactionId: {
            type: String,
            required: true,
            unique: true,
        },

        status: {
            type: String,
            required: true,
            enum: ["PENDING", "SUCCESS", "FAILED"],
            default: "PENDING",
        },
    },

    { timestamps: true },
)

module.exports = mongoose.model("Payment", paymentSchema);