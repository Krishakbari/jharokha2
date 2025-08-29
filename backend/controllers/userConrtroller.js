import jwt from "jsonwebtoken"
import { comparedPassword, hashPassword } from "../helpers/authHelpers.js"
import userModel from "../models/userModel.js"


export const registerController = async (req, res) => {
    try {
        const { fullName, email, password } = req.body
        // validation

        if (!email) {
            return res.send({ message: "email is required" })
        }
        if (!password) {
            return res.send({ message: "password is required" })
        }
        if (!fullName) {
            return res.send({ message: "fullname is required" })
        }

        //existing user 
        const existingUser = await userModel.findOne({ email })
        if (existingUser) {
            return res.status(500).send({
                success: false,
                message: "already registered",
            })
        }

        // register user
        const hashedPassword = await hashPassword(password)
        const user = await new userModel({ fullName, email, password: hashedPassword }).save()
        res.status(200).send({
            success: true,
            message: "registration successfull",
            user
        })

    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).send({
            success: false,
            message: "Internal Server Error",
            error: error.message, // log only useful info
        });
    }
}


// LOGIN
export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).send({
                success: false,
                message: "Invalid email or password",
            });
        }

        // Check user
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(200).send({
                success: false,
                message: "Email is not registered",
            });
        }

        // Compare password
        const match = await comparedPassword(password, user.password);
        if (!match) {
            return res.status(200).send({
                success: false,
                message: "Invalid credentials",
            });
        }

        // ✅ Create JWT with both _id and email
        const token = await jwt.sign(
            { _id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // ✅ Send response
        res.status(200).send({
            success: true,
            message: "Login successfully",
            user: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
            },
            token,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in login",
            error,
        });
    }
};




export const updateProfileController = async (req, res) => {
    try {
        const updatedUser = await userModel.findByIdAndUpdate(
            req.user._id,
            { ...req.body },
            { new: true }
        );

        res.status(200).send({
            success: true,
            message: "Profile updated",
            updatedUser,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error updating profile",
            error,
        });
    }
};
export const profile = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id).select("-password");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, user });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error", error: err.message });
    }

};