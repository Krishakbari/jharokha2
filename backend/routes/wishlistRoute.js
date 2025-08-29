import express from "express";
import { requiredSignIn } from "../middleware/authMiddleware.js";
import { addToWishlist, getWishlist, removeFromWishlist } from "../controllers/wishlistController.js";

const router = express.Router();

router.post("/", requiredSignIn, addToWishlist);
router.get("/", requiredSignIn, getWishlist);
router.delete("/:productId", requiredSignIn, removeFromWishlist);

export default router;
