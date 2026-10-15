const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
    try {

        // Get authorization header
        const authHeader = req.headers.authorization;
        if(!authHeader) {
            return res.status(401).json({
                message: "Authorization token required",
            });
        }

        const token = authHeader.split(" ")[1];

        if(!token) {
            return res.status(401).json({
                message: "Invalid authorization format",
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        console.log(decoded.id);

        const user = await User.findById(decoded.id);

        if(!user) {
            return res.status(401).json({
                message: "User not found",
            });
        }

        req.user = user;

        next();


    } catch (error) {
        console.log(error);

        return res.status(401).json({
            message: "Invalid or expired token",
        })
    }
}

module.exports = authMiddleware;