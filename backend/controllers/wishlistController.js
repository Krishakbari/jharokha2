import Wishlist from "../models/wishlist.js";

// ➕ Add to wishlist
export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    const exists = await Wishlist.findOne({
      user: req.user._id,
      product: productId,
    });

    if (exists) {
      return res.status(400).json({ success: false, message: "Already added" });
    }

    const item = await Wishlist.create({ user: req.user._id, product: productId });
    const populatedItem = await item.populate("product");

    res.json({ success: true, item: populatedItem });
  } catch (err) {
    console.error("Add to wishlist error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 📃 Get wishlist for user (with populated product and images)
export const getWishlist = async (req, res) => {
  try {
    const items = await Wishlist.find({ user: req.user._id }).populate({
      path: "product",
      populate: {
        path: "images",
        model: "ProductImage",
      },
    });

    res.json({ success: true, items });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching wishlist" });
  }
};


// ❌ Remove from wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    await Wishlist.findOneAndDelete({ user: req.user._id, product: productId });
    res.status(200).json({ success: true, message: "Removed from wishlist" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", err });
  }
};
