// routes/cartRoutes.js
import express from "express";
import { requiredSignIn } from "../middleware/authMiddleware.js";
import {
  addToCartController,
  getCartController,
  removeFromCartController,
  updateQuantityController,
} from "../controllers/cartController.js";
import cartModel from "../models/cartModel.js";

const router = express.Router();

router.get("/", requiredSignIn, getCartController);
router.post("/", requiredSignIn, addToCartController);
router.delete("/:productId", requiredSignIn, removeFromCartController);
router.patch("/:productId", requiredSignIn, updateQuantityController);
// routes/cart.js
router.delete("/clear", requiredSignIn, async (req, res) => {
  try {
    await cartModel.deleteMany({ user: req.user._id });
    res.json({ success: true, message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});


export default router;
