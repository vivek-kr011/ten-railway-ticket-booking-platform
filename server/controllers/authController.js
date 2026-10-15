const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/* REGISTER */

module.exports.signup = async (req, res, next) => {
    try {
        const { name, email, phone, password } = req.body;

        const existingUser = await User.findOne({ email });

        if(existingUser) {
            return res.status(409).json({
                message: "Email already registered",
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name, 
            email,
            phone,
            password: hashedPassword,
        });

        const savedUser = await newUser.save();

        res.status(201).json({
            message: "User registered successfully",
            user:{
                id: savedUser._id,
                name: savedUser.name,
                email: savedUser.email,
                phone: savedUser.phone,
                role: savedUser.role,
            }
        })

    } catch(error){
        console.log(error);
        next(error);
    }
}

/* LOGIN USER */

module.exports.login = async (req, res, next) => {
    try {
        
        const {email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if(!existingUser) {
            return res.status(401).json({
                message: "Invalid email or password"
            })
        } 

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

        if(!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid email or password"
            })
        }

        const token = jwt.sign(
            {
                id: existingUser._id,
            }, 
            process.env.JWT_SECRET, 
            { 
                expiresIn: "3d" ,
            }
        );

        // 7. Send response
        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: existingUser._id,
                name: existingUser.name,
                email: existingUser.email,
                phone: existingUser.phone,
                role: existingUser.role,
            },
        });


    } catch (error) {
        console.log(error);
        next(error);
    }
}

module.exports.getCurrentUser = async ( req, res, next ) => { 
    try {

        return res.status(200).json({
            message: "Current User",
            user: {
                id: req.user._id,
                name: req.user.name,
                email: req.user.email,
                phone: req.user.phone,
                role: req.user.role,
            },
        });
    } catch (error) {
        next(error);
    }
}