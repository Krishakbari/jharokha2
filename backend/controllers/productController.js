import Product from "../models/productModel.js";
import slugify from "slugify";
import ProductImage from "../models/imageModel.js";
import path from 'path';
import fs from 'fs';

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      subcategory,
      newArrivals,
      bestSellers,
      weddingCollection,
      navaratriCollection,
      isReel,
      instaLink,
      colors,
      sizes,
      price,
      totalStock,
      fabric,
      workDetails,
      priceBeforeDiscount,
      details,
      materialAndCare,
      shippingAndReturn,
    } = req.body;

    // Validate required fields
    if (!name || !description || !category || !subcategory || !totalStock || !price || newArrivals == undefined || weddingCollection == undefined || navaratriCollection == undefined || bestSellers == undefined) {
      return res.status(400).json({ message: "Required fields are missing" });
    }

    // Parse sizes
    let sizesArray = [];
    if (sizes) {
      try {
        sizesArray = typeof sizes === "string" ? JSON.parse(sizes) : sizes;
        if (!Array.isArray(sizesArray)) sizesArray = [sizesArray];
      } catch (err) {
        return res.status(400).json({ message: "Invalid sizes format" });
      }
    }

    // Parse colors
    let colorsArray = [];
    if (colors) {
      try {
        colorsArray = typeof colors === "string" ? JSON.parse(colors) : colors;
        if (!Array.isArray(colorsArray)) colorsArray = [colorsArray];
      } catch (err) {
        return res.status(400).json({ message: "Invalid colors format" });
      }
    }

    // Generate slug
    const slug = slugify(name, { lower: true, strict: true });

    // Create product
    const product = new Product({
      name,
      slug,
      description,
      category,
      newArrivals: newArrivals === "true" || newArrivals === true,
      bestSellers: bestSellers === "true" || bestSellers === true,
      navaratriCollection: navaratriCollection === "true" || navaratriCollection === true,
      weddingCollection: weddingCollection === "true" || weddingCollection === true,
      isReel: isReel === "true" || isReel === true,
      instaLink,
      totalStock,
      subcategory,
      colors: colorsArray,
      sizes: sizesArray,
      price,
      fabric,
      workDetails,
      priceBeforeDiscount,
      details,
      materialAndCare,
      shippingAndReturn,
    });

    await product.save();

    // Handle image upload
    const files = req.files || [];
    if (files.length > 0) {
      const imageDocs = await Promise.all(
        files.map(async (file, index) => {
          const image = new ProductImage({
            product: product._id,
            url: `/img/${file.filename}`, // changed here
            alt: name,
            order: index,
          });
          await image.save();
          return image._id;
        })
      );

      product.images = imageDocs;
      await product.save();
    }


    res.status(201).json({
      message: "Product created successfully",
      product
    });
  } catch (error) {
    console.error("Product creation error:", error);
    res.status(500).json({ message: "Error creating product", error: error.message });
  }
};


export const getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("category", "name slug")
      .populate("subcategory", "name slug")
      .populate("images"); // <-- add this too

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
};

// controllers/productController.js
import Category from "../models/categoryModel.js";

export const getProductsByCategory = async (req, res) => {
  try {
    const { category, categoryId } = req.query; // ADD categoryId here
    let filter = {};

    if (categoryId) {
      filter.category = categoryId;
    } else if (category) {
      const categoryDoc = await Category.findOne({
        name: { $regex: category, $options: "i" },
      });

      if (!categoryDoc) {
        return res.json([]); 
      }

      filter.category = categoryDoc._id;
    }

    const products = await Product.find(filter)
      .populate("category", "name slug")
      .populate("subcategory", "name slug")
      .populate("images");

    res.json(products);
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(500).json({
      message: "Error fetching products",
      error: error.message,
    });
  }
};


export const getProductsBySubcategory = async (req, res) => {
  try {
    const { subcategoryId } = req.query;
    if (!subcategoryId) {
      return res.status(400).json({ message: "subcategoryId is required" });
    }

    const products = await Product.find({ subcategory: subcategoryId })
      .populate("category", "name slug")
      .populate("subcategory", "name slug")
      .populate("images");

    res.json(products);
  } catch (error) {
    console.error("Error fetching products by subcategory:", error);
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
};



// ====================
// Get single product
// ====================
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id)
      .populate("category", "name slug")
      .populate("subcategory", "name slug")
      .populate("images");

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product", error: error.message });
  }
};


export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    let product = await Product.findById(id).populate("images");
    if (!product) return res.status(404).json({ message: "Product not found" });

    const {
      name,
      description,
      category,
      subcategory,
      newArrivals,
      bestSellers,
      navaratriCollection,
      weddingCollection,
      isReel,
      instaLink,
      colors,
      sizes,
      price,
      fabric,
      totalStock,
      workDetails,
      priceBeforeDiscount,
      details,
      materialAndCare,
      shippingAndReturn,
    } = req.body;

    if (name) {
      product.name = name;
      product.slug = slugify(name, { lower: true, strict: true });
    }
    if (description) product.description = description;
    if (category) product.category = category;
    if (subcategory) product.subcategory = subcategory;
    if (price) product.price = price;
    if (totalStock) product.totalStock = totalStock;
    if (fabric) product.fabric = fabric;
    if (workDetails) product.workDetails = workDetails;
    if (priceBeforeDiscount !== undefined) product.priceBeforeDiscount = priceBeforeDiscount;
    if (details) product.details = details;
    if (materialAndCare) product.materialAndCare = materialAndCare;
    if (shippingAndReturn) product.shippingAndReturn = shippingAndReturn;
    if (instaLink) product.instaLink = instaLink;
    if (newArrivals !== undefined) {
      product.newArrivals = newArrivals === "true" || newArrivals === true;
    }
    if (bestSellers !== undefined) {
      product.bestSellers = bestSellers === "true" || bestSellers === true;
    }
    if (navaratriCollection !== undefined) {
      product.navaratriCollection = navaratriCollection === "true" || navaratriCollection === true;
    }
    if (weddingCollection !== undefined) {
      product.weddingCollection = weddingCollection === "true" || weddingCollection === true;
    }
    if (isReel !== undefined) {
      product.isReel = isReel === "true" || isReel === true;
    }

    // Handle colors
    if (colors) {
      try {
        product.colors = typeof colors === "string" ? JSON.parse(colors) : colors;
      } catch {
        return res.status(400).json({ message: "Invalid colors format" });
      }
    }

    // Handle sizes
    if (sizes) {
      try {
        product.sizes = typeof sizes === "string" ? JSON.parse(sizes) : sizes;
      } catch {
        return res.status(400).json({ message: "Invalid sizes format" });
      }
    }

    // Replace images if provided
    if (req.files && req.files.length > 0) {
      // Remove old images from disk and DB
      for (const img of product.images) {
        const imagePath = path.join("uploads", img.url.replace("/img/", ""));
        if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
        await ProductImage.findByIdAndDelete(img._id);
      }

      // Add new images
      const imageDocs = await Promise.all(
        req.files.map(async (file, index) => {
          const image = new ProductImage({
            product: product._id,
            url: `/img/${file.filename}`,
            alt: name || product.name,
            order: index,
          });
          await image.save();
          return image._id;
        })
      );

      product.images = imageDocs;
    }

    await product.save();

    res.json({ message: "Product updated successfully", product });
  } catch (error) {
    res.status(500).json({ message: "Error updating product", error: error.message });
  }
};

// ====================
// Delete product
// ====================
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    const images = await ProductImage.find({ product: id });

    // Delete files from local disk
    images.forEach(img => {
      const filePath = path.join(process.cwd(), 'public', 'img', img.url.replace('/img/', ''));
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log("Deleted:", filePath);
      }
    });

    await ProductImage.deleteMany({ product: id });
    await Product.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: "Product and images deleted" });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
};