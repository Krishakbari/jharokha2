import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    country: {
        type: String,
    },
    firstName: {
        type: String,
        // required: true,
        trim: true,
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        default: "", // optional for Google users
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        default: "", // not required for Google users
    },
    phone: {
        type: String,
        default: "",
    },
    city: {
        type: String,
        default: "",
    },
    state: {
        type: String,
        default: "",
    },
    area: {
        type: String,
        default: "",
    },
    address: {
        type: String,
        default: "",
    },
    landmarks: {
        type: String,
        default: "",
    },
    pincode: {
        type: Number,
        default: 0,
    },
    type: {
        type: String,
        default: "Home",
        enum: ["Home", "Office", "Other"],
    },

}, { timestamps: true });

export default mongoose.model("users", userSchema);