// controllers/cartController.js
import cartModel from "../models/cartModel.js";
import productModel from "../models/productModel.js";

// Get cart
export const getCartController = async (req, res) => {
  try {
    const cart = await cartModel.findOne({ user: req.user._id }).populate({
      path: "items.product",
      populate: {
        path: "images",
        model: "ProductImage",
      },
    });

    if (!cart) return res.status(200).json({ items: [], total: 0 });

    const cleanedItems = cart.items.filter(
      (item) => item.product && typeof item.product.price === "number"
    );

    if (cleanedItems.length !== cart.items.length) {
      cart.items = cleanedItems;
      await cart.save();
    }

    const total = cleanedItems.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );

    res.status(200).json({ items: cleanedItems, total });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch cart", message: err.message });
  }
};

// Add to cart
export const addToCartController = async (req, res) => {
  let { productId, quantity, color } = req.body;
  // let { productId, quantity, size, color } = req.body;

  // Normalize missing values to null
  // size = size || null;
  color = color || null;

  try {
    let cart = await cartModel.findOne({ user: req.user._id });
    if (!cart) cart = new cartModel({ user: req.user._id, items: [] });

    const existingItem = cart.items.find(
      (item) =>
        item.product.equals(productId) &&
        // (item.size === size || (item.size == null && size == null)) &&
        (item.color === color || (item.color == null && color == null))
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity, color });
      // cart.items.push({ product: productId, quantity, size, color });
    }

    await cart.save();
    res.status(200).json({ success: true, message: "Cart updated", cart });
  } catch (err) {
    res.status(500).json({ error: "Could not add to cart", message: err.message });
  }
};

// Remove from cart
export const removeFromCartController = async (req, res) => {
  let { productId } = req.params;
  let { color } = req.query;
  // let { size, color } = req.query;

  // size = size || null;
  color = color || null;

  try {
    const cart = await cartModel.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    cart.items = cart.items.filter(
      (item) =>
        !(
          item.product.equals(productId) &&
          // (item.size === size || (item.size == null && size == null)) &&
          (item.color === color || (item.color == null && color == null))
        )
    );

    if (cart.items.length === 0) {
      await cartModel.deleteOne({ _id: cart._id });
      return res.status(200).json({ success: true, message: "Cart deleted" });
    }

    await cart.save();
    res.status(200).json({ success: true, message: "Item removed", cart });
  } catch (err) {
    res.status(500).json({ error: "Could not remove item", message: err.message });
  }
};

// Update quantity
export const updateQuantityController = async (req, res) => {
  const { productId } = req.params;
  let { quantity, color } = req.body;
  // let { quantity, size, color } = req.body;

  // size = size || null;
  color = color || null;

  try {
    const cart = await cartModel.findOne({ user: req.user._id }).populate({
      path: "items.product",
      populate: {
        path: "images",
        model: "ProductImage",
      },
    });

    if (!cart) return res.status(404).json({ error: "Cart not found" });

    const item = cart.items.find(
      (item) =>
        item.product._id.equals(productId) &&
        // (item.size === size || (item.size == null && size == null)) &&
        (item.color === color || (item.color == null && color == null))
    );

    if (!item) return res.status(404).json({ error: "Item not found in cart" });

    item.quantity = quantity < 1 ? 1 : quantity;
    await cart.save();

    const total = cart.items.reduce(
      (acc, item) => acc + (item.product?.price || 0) * item.quantity,
      0
    );

    res.status(200).json({ success: true, message: "Quantity updated", cart, total });
  } catch (err) {
    res.status(500).json({ error: "Could not update quantity", message: err.message });
  }
};
