import Category from "../models/categoryModel.js";
import slugify from "slugify";
import fs from "fs";
import path from "path";


// Create Category or Subcategory
export const createCategory = async (req, res) => {
  try {
    const { name, parentId } = req.body;
    if (!name) return res.status(400).json({ message: "Name is required" });

    let image = "";
    if (req.file) {
      image = req.file.filename;
    }

    const slug = slugify(name, { lower: true, strict: true });

    const category = new Category({
      name,
      slug,
      image,
      parent: parentId || null
    });

    await category.save();
    res.status(201).json({
      message: parentId ? "Subcategory created" : "Category created",
      category
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating category", error: error.message });
  }
};

// Get all main categories (for homepage)
export const getMainCategories = async (req, res) => {
  try {
    const categories = await Category.find({ parent: null });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories", error: error.message });
  }
};

// Get subcategories by parent slug
export const getSubcategoriesBySlug = async (req, res) => {
  try {
    const { parentSlug } = req.params;
    const parentCategory = await Category.findOne({ slug: parentSlug });
    if (!parentCategory) return res.status(404).json({ message: "Parent category not found" });

    const subcategories = await Category.find({ parent: parentCategory._id });
    res.json(subcategories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching subcategories", error: error.message });
  }
};


// ====================
// Update Category
// ====================
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params; // category id
    const { name, parentId } = req.body;

    const category = await Category.findById(id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    if (name) {
      category.name = name;
      category.slug = slugify(name, { lower: true, strict: true });
    }

    if (parentId !== undefined) {
      category.parent = parentId || null;
    }

    // Update image if provided
    if (req.file) {
      // Delete old image if exists
      if (category.image) {
        const oldImagePath = path.join("uploads", category.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      category.image = req.file.filename;
    }

    await category.save();
    res.json({ message: "Category updated successfully", category });
  } catch (error) {
    res.status(500).json({ message: "Error updating category", error: error.message });
  }
};

// ====================
// Delete Category
// ====================
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    // Helper to delete image safely
    const deleteImage = (imagePath) => {
      if (!imagePath) return;

      // Remove any starting slash and get only file name
      const fileName = path.basename(imagePath);
      const fullPath = path.join(process.cwd(), "uploads", fileName);

      try {
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      } catch (err) {
        console.error("Error deleting image file:", err);
      }
    };

    // Delete subcategories if parent
    if (!category.parent) {
      const subcategories = await Category.find({ parent: category._id });
      for (let sub of subcategories) {
        deleteImage(sub.image);
        await Category.findByIdAndDelete(sub._id);
      }
    }

    // Delete main category image
    deleteImage(category.image);

    // Delete main category
    await Category.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: "Category and its subcategories deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ error: "Error deleting category" });
  }
};