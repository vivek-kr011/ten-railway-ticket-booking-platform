const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new Schema(
    {
        pnr:{
            type: String,
            required: true,
            unique: true,
        },

        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        train: {
            type: Schema.Types.ObjectId,
            ref: "Train",
            required: true,
        },

        schedule: {
            type: Schema.Types.ObjectId,
            ref: "Schedule",
            required: true,
        },

        classType: {
            type: String,
            required: true,
        },

        passengers: [
            {
                name: {
                    type: String,
                    required: true,
                },

                age: {
                    type: Number,
                    required: true,
                },

                gender:{
                    type: String,
                    required: true,
                    enum: ["MALE", "FEMALE", "OTHER"],
                },

            },
        ],

        totalFare: {
            type: Number,
            required: true,
        },

        bookingStatus: {
            type: String,
            required: true,
            enum: ["PENDING", "CONFIRMED", "CANCELLED",],
            default: "PENDING",
        },

        paymentStatus: {
            type: String,
            enum: ["PENDING", "PAID", "FAILED"],
            default: "PENDING",
        },
    },


    {timestamps: true},
);

module.exports = mongoose.model("Booking", bookingSchema);