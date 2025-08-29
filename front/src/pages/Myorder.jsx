import { useEffect, useState } from "react";
import axios from "axios";
import { API } from "../constant";

const MyOrders = () => {
    const [loading, setLoading] = useState(true);
    const [activeOrders, setActiveOrders] = useState([]);
    const [completedOrders, setCompletedOrders] = useState([]);
    // const [cancelledOrders, setCancelledOrders] = useState([]);

    const token = JSON.parse(localStorage.getItem("auth"))?.token;

    const fetchOrders = async () => {
        try {
            if (!token) {
                console.warn("No token found in localStorage");
                setLoading(false);
                return;
            }
            const { data } = await axios.get(`${API}/order/me`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (data.success) {
                setActiveOrders(data.orders.filter(o => o.status !== "Cancelled" && o.status !== "Delivered"));
                setCompletedOrders(data.orders.filter(o => o.status === "Delivered"));
                // setCancelledOrders(data.orders.filter(o => o.status === "Cancelled"));
            }
        } catch (err) {
            console.error("Error fetching orders", err);
        } finally {
            setLoading(false);
        }
    };

    // const cancelOrder = async (orderId) => {
    //     if (!window.confirm("Are you sure you want to cancel this order?")) return;
    //     try {
    //         const { data } = await axios.delete(`${API}/order/cancel/${orderId}`, {
    //             headers: { Authorization: `Bearer ${token}` },
    //         });
    //         if (data.success) {
    //             fetchOrders();
    //         } else {
    //             alert(data.message || "Failed to cancel order");
    //         }
    //     } catch (error) {
    //         console.error("Cancel order error:", error);
    //         alert("An error occurred while cancelling the order.");
    //     }
    // };

    // const trashOrder = async (orderId) => {
    //     if (!window.confirm("Are you sure you want to permanently delete this order?")) return;
    //     try {
    //         const { data } = await axios.delete(`${API}/order/trash/${orderId}`, {
    //             headers: { Authorization: `Bearer ${token}` },
    //         });
    //         if (data.success) {
    //             fetchOrders();
    //         } else {
    //             alert(data.message || "Failed to delete order");
    //         }
    //     } catch (error) {
    //         console.error("Trash delete error:", error);
    //         alert("An error occurred while deleting the order.");
    //     }
    // };

    useEffect(() => {
        fetchOrders();
    }, []);

    const renderOrderCard = (order, index) => (
    // const renderOrderCard = (order, index, showCancel = false, isCancelled = false) => (
        <div
            key={order._id}
            // className={`border rounded-xl mb-6 p-4 shadow-sm bg-white ${isCancelled ? "opacity-80" : ""}`}
            className={`border rounded-xl mb-6 p-4 shadow-sm bg-white `}
        >
            <div className="flex justify-between items-center mb-4">
                <div className="font-medium text-lg">
                    Order #{order._id.slice(-6).toUpperCase()}
                </div>
                <div className="text-sm text-gray-600">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                </div>
            </div>

            {order.items.map((item, i) => (
                <div
                    key={item._id + "-" + i}
                    className="flex items-center py-2 border-b last:border-b-0 gap-4"
                >
                    <img
                        src={`${API}${item.product?.images?.[0]?.url || "/img/default.jpg"}`}
                        alt="Product"
                        className="w-52 h-52 object-contain rounded-md"
                    />

                    <div className="flex-1">
                        <div className="font-semibold">{item.product.name}</div>
                        <div className="text-sm text-gray-600">
                            Qty: {item.quantity}
                            {/* Size: {item.size || "N/A"} | Qty: {item.quantity} */}
                        </div>
                        <div className="flex items-center gap-2 mt-4 text-sm text-gray-600">
                            Color:
                            {item.color ? (
                                <span
                                    className="inline-block w-5 h-5 rounded-full border shadow-sm"
                                    style={{ backgroundColor: item.color }}
                                />
                            ) : (
                                "Default"
                            )}
                        </div>
                    </div>
                    <div className="font-medium">₹{item.price}</div>
                </div>
            ))}

            <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-gray-700">
                    <span className="font-medium">Status:</span>{" "}
                    <span className="capitalize">{order.status}</span>
                </div>
                <div className="text-sm font-semibold">Total: ₹{order.total}</div>
                {/* {showCancel && (
                    <button
                        onClick={() => cancelOrder(order._id)}
                        className="px-4 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded"
                    >
                        Cancel Order
                    </button>
                )}
                {isCancelled && (
                    <button
                        onClick={() => trashOrder(order._id)}
                        className="px-4 py-2 text-sm bg-gray-700 hover:bg-gray-800 text-white rounded"
                    >
                        Delete Permanently
                    </button>
                )} */}
            </div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto py-10 px-4">
            <h1 className="text-2xl font-bold mb-6">My Orders</h1>
            {/* <div className="bg-yellow-100 text-yellow-800 px-4 py-3 rounded mb-6 text-sm border border-yellow-300">
                <strong>Note:</strong> Orders can only be canceled while in{" "}
                <span className="font-medium">Pending</span> or{" "}
                <span className="font-medium">Preparing</span> status. Once shipped, they cannot be canceled.
            </div> */}

            {loading ? (
                <p className="text-center text-gray-500">Loading orders...</p>
            ) : (
                <>
                    {/* Active Orders */}
                    <h2 className="text-xl font-semibold mb-2">Active Orders</h2>
                    {activeOrders.length === 0 ? (
                        <p className="text-gray-500">No active orders.</p>
                    ) : (
                        activeOrders.map((order, index) =>
                            renderOrderCard(order, index, ["Accepted", "Preparing"].includes(order.status))
                        )
                    )}

                    {/* Completed Orders */}
                    <h2 className="text-xl font-semibold mt-10 mb-2">Completed Orders</h2>
                    {completedOrders.length === 0 ? (
                        <p className="text-gray-500">No completed orders.</p>
                    ) : (
                        completedOrders.map((order, index) => renderOrderCard(order, index))
                    )}

                    {/* Cancelled Orders */}
                    {/* <h2 className="text-xl font-semibold mt-10 mb-2">Cancelled Orders (Trash)</h2>
                    {cancelledOrders.length === 0 ? (
                        <p className="text-gray-500">No cancelled orders.</p>
                    ) : (
                        cancelledOrders.map((order, index) =>
                            renderOrderCard(order, index, false, true)
                        )
                    )} */}
                </>
            )}
        </div>
    );
};

export default MyOrders;
