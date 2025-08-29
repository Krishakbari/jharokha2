import express from "express";
import { createCategory, deleteCategory, getMainCategories, getSubcategoriesBySlug, updateCategory } from "../controllers/categoryController.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Create category or subcategory
router.post("/category", upload.single("image"), createCategory);

// Get main categories
router.get("/categories", getMainCategories);

// Get subcategories using parent slug
router.get("/categories/:parentSlug", getSubcategoriesBySlug);

// Update category

router.put("/category/:id", upload.single("image"), updateCategory);

// Delete category
router.delete("/category/:id", deleteCategory);


export default router;
