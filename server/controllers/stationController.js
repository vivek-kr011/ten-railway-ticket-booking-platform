const mongoose = require("mongoose");
const Station = require("../models/Station");

module.exports.createStation = async (req, res, next) => {
    try {

        const { name, code, city, state } = req.body;

        const existingStation = await Station.findOne({ code });

        if (existingStation) {
            return res.status(409).json({
                message: "Station already exists",
            });
        }

        const newStation = new Station({
            name,
            code,
            city,
            state,
        });

        const savedStation = await newStation.save();

        return res.status(201).json({
            message: "Station created successfully",
            station: savedStation,
        });

    } catch (error) {
        next(error);
    }
};

module.exports.getStations = async (req, res, next) => {

    try {
        const stations = await Station.find();

        return res.status(200).json({
            message: "Station fetched successfully.",
            stations,
        });
    } catch (error) {
        next(error);
    }
};

module.exports.getSingleStation = async (req, res, next) => {

    try {

        const id = req.params.id;

        const station = await Station.findById(id);

        if(!station) {
            return res.status(404).json({
                message: "Station not found.",
            });
        }

        res.status(200).json({
            message: "Station found successfully.",
            station,
        })

    } catch(error) {    
        console.log(error);
        next(error);
    }
};

module.exports.updateStation = async (req, res, next) => {

    try {

        const id = req.params.id;

        const { name, code, city, state } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid station ID. Please provide a valid station ID.",
            });
        }

        const station = await Station.findById(id);

        if(!station) {
            return res.status(404).json({
                message: "Station not found."
            });
        };

        // res.status(200).json({
        //     message: "Station found successfully."
        // });

        const existingStation = await Station.findOne({
            code: code,
            _id: { $ne: id }
        });

        if(existingStation) {
            return res.status(409).json({
                message: "Station code is alreaddy exists."
            });
        };    
        
        station.name = name;
        station.code = code;
        station.city = city;
        station.state = state;

        const updatedStation = await station.save();

        res.status(200).json({
            message: "Station updated successfully.",
            updatedStation
        })

    } catch (error) {
        next(error);
    }
};

module.exports.deleteStation = async (req, res, next) => {

    try {

        const id = req.params.id;

        if(!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid station ID. Please provide a valid station ID.",
            });
        }


        const station = await Station.findById(id);

        if(!station) {
            return res.status(404).json({
                message: "Station not found.",
            });
        }

        const deleteStation = await Station.findByIdAndDelete(id);

        console.log(deleteStation);

        return res.status(200).json({
            message: "Station deleted successfully.",
            station: deleteStation,
        });

    } catch (error) {
        console.log(error);

        next(error)
    }
}