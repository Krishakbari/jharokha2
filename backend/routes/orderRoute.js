import express from "express";
import {
  placeOrderController,
  getUserOrdersController,
  cancelOrderController,
  getOrderController,
  getAllOrdersController,
  updateOrderStatusController,
  getOrderStatsController,
  getAllUsers
} from "../controllers/orderController.js";
import { requiredSignIn, adminOnly } from "../middleware/authMiddleware.js";
import orderModel from "../models/orderModel.js";

const router = express.Router();

// USER ROUTES
router.post("/place", requiredSignIn, placeOrderController);
router.get("/me", requiredSignIn, getUserOrdersController);
router.get("/single/:orderId", requiredSignIn, getOrderController);
router.delete("/cancel/:orderId", requiredSignIn, cancelOrderController);

// Trash order (permanent delete) - only for cancelled orders
router.delete("/trash/:orderId", requiredSignIn, async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user._id;

    const order = await orderModel.findOne({ 
      _id: orderId, 
      user: userId 
    });

    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: "Order not found" 
      });
    }

    if (order.status !== "Cancelled") {
      return res.status(400).json({ 
        success: false, 
        message: "Only cancelled orders can be permanently deleted" 
      });
    }

    await orderModel.findByIdAndDelete(orderId);

    res.json({ 
      success: true, 
      message: "Order permanently deleted" 
    });
  } catch (err) {
    console.error("Trash delete error:", err);
    res.status(500).json({ 
      success: false, 
      message: "Failed to delete order" 
    });
  }
});

// ADMIN ROUTES
router.get("/admin/all", requiredSignIn, adminOnly, getAllOrdersController);
router.get("/admin/users", requiredSignIn, adminOnly, getAllUsers);
router.get("/admin/stats", requiredSignIn, adminOnly, getOrderStatsController);
router.put("/admin/status/:orderId", requiredSignIn, adminOnly, updateOrderStatusController);

// Admin: Get single order (with full details)
router.get("/admin/single/:orderId", requiredSignIn, adminOnly, async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await orderModel
      .findById(orderId)
      .populate('items.product', 'name images price slug description category')
      .populate('user', 'name email phone address');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    res.status(200).json({
      success: true,
      order: order
    });

  } catch (error) {
    console.error("Get admin order error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
      error: error.message
    });
  }
});

// Admin: Delete order permanently (any status)
router.delete("/admin/delete/:orderId", requiredSignIn, adminOnly, async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    await orderModel.findByIdAndDelete(orderId);

    res.json({
      success: true,
      message: "Order permanently deleted by admin"
    });
  } catch (error) {
    console.error("Admin delete error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete order"
    });
  }
});

// Bulk status update for multiple orders
router.put("/admin/bulk-status", requiredSignIn, adminOnly, async (req, res) => {
  try {
    const { orderIds, status } = req.body;

    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order IDs array is required"
      });
    }

    const validStatuses = ["Accepted", "Preparing", "Shipped", "Delivered", "Cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status"
      });
    }

    const result = await orderModel.updateMany(
      { _id: { $in: orderIds } },
      { status: status }
    );

    res.json({
      success: true,
      message: `${result.modifiedCount} orders updated to ${status}`,
      modifiedCount: result.modifiedCount
    });

  } catch (error) {
    console.error("Bulk update error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update orders"
    });
  }
});

export default router;