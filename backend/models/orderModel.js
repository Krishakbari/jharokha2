
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true,
        },
        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                },
                price: {
                    type: Number,
                    required: true,
                },
                size: {
                    type: String,
                    required: true,
                },
                color: {
                    type: String,
                    required: true,
                },
            },
        ],
        total: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            default: "Accepted",
            enum: ["Pending", "Accepted", "Preparing", "Shipped", "Delivered", "Cancelled"],
        },
        // ✅ Add shipping address fields
        shippingAddress: {
            address: {
                type: String,
                required: true,
            },
            city: {
                type: String,
                required: true,
            },
            state: {
                type: String,
                required: true,
            },
            pincode: {
                type: String,
                required: true,
            },
            country: {
                type: String,
                required: true,
            },
            phone: {
                type: String,
                required: true,
            },
        },
    },
    { timestamps: true }
);

export default mongoose.model("Order", orderSchema);