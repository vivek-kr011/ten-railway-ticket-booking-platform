const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
        }, 

        password: {
            type: String,
            required: true,
        },

        phone: {
            type: String,
            required: true,
        },

        role: {
            type: String,
            enum: ["USER", "ADMIN"],
            default: "USER",
        },
    },
    {timestamps: true},
);
module.exports =  mongoose.model("User", userSchema);