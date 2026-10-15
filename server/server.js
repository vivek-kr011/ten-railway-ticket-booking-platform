const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');


const authRoutes = require("./routes/authRoutes");
const stationRoutes = require("./routes/stationRoutes");
const trainRoutes = require("./routes/trainRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const adminRoutes = require("./routes/adminRoutes");

dotenv.config();

const connectDB = require("./config/db");

const app = express();

app.use( cors() );
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/stations", stationRoutes);
app.use("/api/trains", trainRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);

app.use("/api/admin", adminRoutes);


connectDB();

app.get("/", (req, res) => {
    res.send("TICKET BOOKING SYSTEM API IS RUNNING...");
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});