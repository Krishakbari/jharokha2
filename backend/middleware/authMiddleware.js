import jwt from "jsonwebtoken"
import userModel from "../models/userModel.js"

// protected route token based
export const requiredSignIn = async (req, res, next) => {
    try {
        let token = req.headers.authorization;

        // Handle both "Bearer token" and just "token" formats
        if (token && token.startsWith('Bearer ')) {
            token = token.slice(7); // Remove "Bearer " prefix
        }

        if (!token) {
            return res.status(401).send({
                success: false,
                message: "Access denied. No token provided."
            });
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decode;
        next();

    } catch (error) {
        console.log(error);
        return res.status(401).send({
            success: false,
            message: "Invalid token"
        });
    }
}

// admin access
export const isAdmin = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.user._id);
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User not found"
            });
        } else {
            next();
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ // Changed from 501 to 500
            success: false,
            error,
            message: "Error in admin middleware"
        });
    }
}


// 
export const adminOnly = (req, res, next) => {
    const adminEmail = "admin@gmail.com"; // Only one admin

    if (req.user.email !== "admin@gmail.com") {
        return res.status(403).json({ success: false, message: "Access denied. Admin only." });
    }

    next();
};


