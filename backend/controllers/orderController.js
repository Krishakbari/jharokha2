import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";
import mongoose from "mongoose";
import cartModel from "../models/cartModel.js";

// PLACE ORDER
// PLACE ORDER
export const placeOrderController = async (req, res) => {
    try {
        const { items, total, shippingAddress, paymentMethod } = req.body;
        const userId = req.user._id;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ success: false, message: "Items are required" });
        }

        if (!total || total <= 0) {
            return res.status(400).json({ success: false, message: "Valid total amount is required" });
        }

        if (!shippingAddress || !shippingAddress.address || !shippingAddress.city ||
            !shippingAddress.state || !shippingAddress.pincode || !shippingAddress.phone) {
            return res.status(400).json({
                success: false,
                message: "Complete shipping address is required"
            });
        }

        // ✅ Check stock & update
        for (const item of items) {
            const product = await productModel.findById(item.product);

            if (!product) {
                return res.status(404).json({ success: false, message: `Product with ID ${item.product} not found` });
            }

            if (item.quantity > product.totalStock) {
                return res.status(400).json({
                    success: false,
                    message: `Not enough stock for ${product.name}. Only ${product.totalStock} left.`
                });
            }

            // 🔥 Reduce stock
            product.totalStock -= item.quantity;
            await product.save();
        }

        // ✅ Create new order
        const order = new orderModel({
            user: userId,
            items,
            total,
            status: "Accepted",
            shippingAddress,
            paymentMethod
        });

        await order.save();
        await order.populate('items.product', 'name images price');
        await order.populate('user', 'name email');

        // ✅ Clear cart
        await cartModel.findOneAndUpdate({ user: userId }, { items: [] });

        res.status(201).json({
            success: true,
            message: "Order placed successfully",
            orderId: order._id
        });

    } catch (error) {
        console.error("Place order error:", error);
        res.status(500).json({ success: false, message: "Failed to place order", error: error.message });
    }
};


// GET USER ORDERS
export const getUserOrdersController = async (req, res) => {
    try {
        const userId = req.user._id;

        const orders = await orderModel
            .find({ user: userId })
            .sort({ createdAt: -1 })
            .populate({
                path: "items.product",
                select: "name price images",
                populate: {
                    path: "images",
                    match: { order: 0 }, // ✅ main thumbnail only
                    select: "url",
                },
            })

        res.status(200).json({
            success: true,
            orders,
        });
    } catch (err) {
        console.error("Get user orders error:", err);
        res.status(500).json({ success: false, message: "Failed to fetch orders" });
    }
};

// CANCEL ORDER
export const cancelOrderController = async (req, res) => {
    try {
        const { orderId } = req.params;
        const userId = req.user._id;

        // Validate order ID
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order ID"
            });
        }

        // Find order
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

        // Check if order can be cancelled
        if (order.status === "Delivered") {
            return res.status(400).json({
                success: false,
                message: "Delivered orders cannot be cancelled"
            });
        }

        if (order.status === "Cancelled") {
            return res.status(400).json({
                success: false,
                message: "Order is already cancelled"
            });
        }

        // Update order status
        order.status = "Cancelled";
        await order.save();

        res.status(200).json({
            success: true,
            message: "Order cancelled successfully",
            order: order
        });

    } catch (error) {
        console.error("Cancel order error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to cancel order",
            error: error.message
        });
    }
};

// GET SINGLE ORDER
export const getOrderController = async (req, res) => {
    try {
        const { orderId } = req.params;
        const userId = req.user._id;

        // Validate order ID
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order ID"
            });
        }

        const order = await orderModel
            .findOne({ _id: orderId, user: userId })
            .populate('items.product', 'name images price slug description')
            .populate('user', 'name email phone');

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
        console.error("Get order error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch order",
            error: error.message
        });
    }
};

// ADMIN: GET ALL ORDERS
export const getAllOrdersController = async (req, res) => {
    try {
        const { page = 1, limit = 20, status, search } = req.query;

        // Build query
        let query = {};
        if (status && status !== 'all') {
            query.status = status;
        }

        // Calculate pagination
        const skip = (page - 1) * limit;

        // Get orders with pagination
        let ordersQuery = orderModel
            .find(query)
            // .populate('items.product', 'name images price slug')
            .populate({
                path: "items.product",
                select: "name price images",
                populate: {
                    path: "images",
                    match: { order: 0 }, // ✅ main thumbnail only
                    select: "url",
                },
            })
            .populate('user', 'fullName email phone address area city state pincode')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        // Add search functionality if search term provided
        if (search) {
            // Search by order ID or user name/email
            const searchRegex = new RegExp(search, 'i');
            query.$or = [
                { _id: mongoose.Types.ObjectId.isValid(search) ? search : null },
                { 'user.name': searchRegex },
                { 'user.email': searchRegex }
            ];
        }

        const orders = await ordersQuery;
        const totalOrders = await orderModel.countDocuments(query);

        // Calculate order statistics
        const stats = await orderModel.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                    totalAmount: { $sum: "$total" }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            orders: orders,
            stats: stats,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalOrders / limit),
                totalOrders: totalOrders,
                hasNextPage: page < Math.ceil(totalOrders / limit),
                hasPrevPage: page > 1
            }
        });

    } catch (error) {
        console.error("Get all orders error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch orders",
            error: error.message
        });
    }
};


import User from "../models/userModel.js";

export const getAllUsers = async (req, res) => {
    try {
        // Get all users without password
        const users = await User.find({}, "-password").lean();

        // Get total purchases per user
        const totals = await orderModel.aggregate([
            {
                $match: { status: "Delivered" } // or whatever status means paid
            },
            {
                $group: {
                    _id: "$user",
                    totalPurchase: { $sum: "$total" },
                },
            },
        ]);

        // Convert totals array to a map for quick lookup
        const totalMap = {};
        totals.forEach(t => {
            totalMap[t._id.toString()] = t.totalPurchase;
        });

        // Attach totalPurchase to each user
        const usersWithTotal = users.map(u => ({
            ...u,
            totalPurchase: totalMap[u._id.toString()] || 0
        }));

        res.status(200).json({ success: true, users: usersWithTotal });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to fetch users" });
    }
};


// ADMIN: UPDATE ORDER STATUS
export const updateOrderStatusController = async (req, res) => {
    try {
        const { status } = req.body;
        const { orderId } = req.params;

        const order = await orderModel.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        );

        res.status(200).json({ success: true, message: "Order updated", order });
    } catch (err) {
        console.error("Update order error:", err);
        res.status(500).json({ success: false, message: "Failed to update order" });
    }
};

// GET ORDER STATISTICS
export const getOrderStatsController = async (req, res) => {
    try {
        const { timeframe = '30' } = req.query; // days
        const days = parseInt(timeframe);
        const dateFrom = new Date();
        dateFrom.setDate(dateFrom.getDate() - days);

        // Overall statistics
        const totalOrders = await orderModel.countDocuments();
        const totalRevenue = await orderModel.aggregate([
            { $group: { _id: null, total: { $sum: "$total" } } }
        ]);

        // Recent orders statistics
        const recentStats = await orderModel.aggregate([
            {
                $match: {
                    createdAt: { $gte: dateFrom }
                }
            },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                    revenue: { $sum: "$total" }
                }
            }
        ]);

        // Daily orders for the timeframe
        const dailyOrders = await orderModel.aggregate([
            {
                $match: {
                    createdAt: { $gte: dateFrom }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                        day: { $dayOfMonth: "$createdAt" }
                    },
                    count: { $sum: 1 },
                    revenue: { $sum: "$total" }
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 }
            }
        ]);

        res.status(200).json({
            success: true,
            stats: {
                totalOrders,
                totalRevenue: totalRevenue[0]?.total || 0,
                recentStats,
                dailyOrders,
                timeframe: `${days} days`
            }
        });

    } catch (error) {
        console.error("Get order stats error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch order statistics",
            error: error.message
        });
    }
};