const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const trainSchema = new Schema(
    {
        trainNumber: {
            type: String,
            required: true,
            unique: true,
        },

        trainName: {
            type: String,
            required: true,
        }, 

        source: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Station",
        },

        destination: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Station",
        },

        classes: [
            {
                classType: {
                    type: String,
                    required: true,
                },

                fare: {
                    type: Number,
                    required: true,
                },

                totalSeats: {
                    type: Number,
                    required: true,
                },

            },
        ],

    },
    {timestamps: true},
)

module.exports = mongoose.model("Train", trainSchema);