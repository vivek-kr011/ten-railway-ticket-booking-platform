const mongoose = require('mongoose');
const Schema = mongoose.Schema;
 
const scheduleSchema = new Schema(
    {
        train: {
            type: Schema.Types.ObjectId,
            ref: "Train",
            required: true,
        },

        journeyDate: {
            type: Date,
            required: true,
        },

        departureTime: {
            type: String,
            required: true,
        },

        arrivalTime: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ["AVAILABLE", "CANCELLED"],
            default: "AVAILABLE",
            required: true,
        },
    },
    {timestamps: true},
)

scheduleSchema.index({ train: 1, journeyDate: 1 }, { unique: true });

module.exports = mongoose.model("Schedule", scheduleSchema);