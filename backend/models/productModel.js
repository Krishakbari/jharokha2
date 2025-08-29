import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true },
    description: { type: String, required: true },
    images: [
        { type: mongoose.Schema.Types.ObjectId, ref: "ProductImage" }
    ],
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    subcategory: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    colors: [{ type: String }],
    sizes: [{ type: String }],
    price: { type: Number, required: true },
    fabric: { type: String, default: "" },
    workDetails: { type: String, default: "" },
    priceBeforeDiscount: { type: Number, default: 0 },
    details: { type: String, default: "" },
    materialAndCare: { type: String, default: "" },
    shippingAndReturn: { type: String, default: "" },
    totalStock: {
        type: Number,
        required: true,
    },
    newArrivals: {
        type: Boolean,
        default: false,
    },
    bestSellers: {
        type: Boolean,
        default: false,
    },
    weddingCollection: {
        type: Boolean,
        default: false,
    },
    navaratriCollection: {
        type: Boolean,
        default: false,
    },
    isReel: {
        type: Boolean,
        default: false,
    },
    instaLink: {
        type: String,
        default: "",
    },
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
