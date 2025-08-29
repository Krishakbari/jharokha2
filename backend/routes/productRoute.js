import express from "express";
import { createProduct, deleteProduct, getProductById, getProducts, getProductsByCategory, getProductsBySubcategory, updateProduct } from "../controllers/productController.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Multiple image upload for products
router.post("/product", upload.array("images", 10), createProduct);

// Get all products
router.get("/products", getProducts);

// product by controller 
router.get("/products/by-category", getProductsByCategory);
router.get("/products/by-subcategory", getProductsBySubcategory);


// Get single product
router.get("/product/:id", getProductById);

// Update product
router.put("/product/:id", upload.array("images", 10), updateProduct);

// Delete product
router.delete("/product/:id", deleteProduct);

// navratri and wedding
import Product from "../models/productModel.js";
router.get("/collection/:type", async (req, res) => {
    try {
        const { type } = req.params;

        let filter = {};
        if (type === "wedding") filter.weddingCollection = true;
        if (type === "navratri") filter.navaratriCollection = true;

        const products = await Product.find(filter).populate("images category subcategory");
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});


// insta
// Add this route in your productRoutes.js file
router.get("/products/reels", async (req, res) => {
    try {
        const reelProducts = await Product.find({ isReel: true })
            .populate("category", "name slug")
            .populate("subcategory", "name slug")
            .populate("images");
        
        res.json(reelProducts);
    } catch (error) {
        console.error("Error fetching reel products:", error);
        res.status(500).json({ 
            message: "Error fetching reel products", 
            error: error.message 
        });
    }
});


export default router;
