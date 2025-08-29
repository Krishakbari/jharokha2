// import { useEffect, useState } from "react";
// import axios from "axios";
// import { API } from "../constant";
// import toast from "react-hot-toast";

// const AdminOrders = () => {
//     const [orders, setOrders] = useState([]);
//     const token = JSON.parse(localStorage.getItem("auth"))?.token;

//     const fetchOrders = async () => {
//         try {
//             const { data } = await axios.get(`${API}/order/admin/all`, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });

//             if (data.success) {
//                 setOrders(data.orders || []);
//             } else {
//                 toast.error(data.message || "Failed to fetch orders");
//             }
//         } catch (error) {
//             console.error("Error fetching admin orders", error);
//             toast.error("Failed to load orders");
//         }
//     };

//     const handleStatusChange = async (orderId, status) => {
//         try {
//             const { data } = await axios.put(
//                 `${API}/order/admin/status/${orderId}`,
//                 { status },
//                 {
//                     headers: { Authorization: `Bearer ${token}` },
//                 }
//             );

//             if (data.success) {
//                 toast.success("Order status updated");
//                 fetchOrders();
//             } else {
//                 toast.error(data.message || "Failed to update status");
//             }
//         } catch (err) {
//             console.error("Error updating order status:", err);
//             toast.error("Error updating order status");
//         }
//     };

//     useEffect(() => {
//         if (token) fetchOrders();
//     }, [token]);

//     return (
//         <div className="w-full px-4 lg:px-8 py-6">
//             <h1 className="text-3xl font-bold mb-6 text-gray-800">All Orders (Admin View)</h1>

//             <div className="">
//                 <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//                     {orders.length > 0 ? (
//                         orders.map((order, idx) => (
//                             <div
//                                 key={order._id}
//                                 className="bg-white border border-gray-200 rounded-xl shadow-lg p-4 hover:shadow-xl transition-shadow duration-300 flex flex-col"
//                             >
//                                 {/* Order Header */}
//                                 <div className="mb-2">
//                                     <span className="text-sm text-gray-500">
//                                         {new Date(order.createdAt).toLocaleString()}
//                                     </span>
//                                 </div>

//                                 {/* User Info */}
//                                 <div className="text-xs text-gray-600 mb-3">
//                                     {order.user ? (
//                                         <>
//                                             <p><strong>Name:</strong> {order.user.fullName || "N/A"}</p>
//                                             <p><strong>Email:</strong> {order.user.email || "N/A"}</p>
//                                             <p><strong>Phone:</strong> {order.user.phone || "N/A"}</p>
//                                             <p>
//                                                 <strong>Address:</strong>{" "}
//                                                 {[order.user.address, order.user.area, order.user.city, order.user.state, order.user.pincode, order.user.country]
//                                                     .filter(Boolean)
//                                                     .join(", ")}
//                                             </p>
//                                         </>
//                                     ) : (
//                                         <p className="text-red-500 font-medium">User info not available</p>
//                                     )}
//                                 </div>

//                                 {/* Order Items with Images */}
//                                 {/* Order Items with Images */}
//                                 <div className="divide-y divide-gray-200 mb-3">
//                                     {order.items?.map((item, i) => (
//                                         <div
//                                             key={item.product?._id + i}
//                                             className="flex items-start gap-4 py-2 text-xs"
//                                         >
//                                             {/* Product Image */}
//                                             {item.product?.images[0] ? (
//                                                 <img
//                                                     src={`${API}${item.product.images[0].url}`}
//                                                     alt={item.product.name}
//                                                     className="w-32 h-32 object-contain rounded"
//                                                 />
//                                             ) : (
//                                                 <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
//                                                     No Image
//                                                 </div>
//                                             )}

//                                             {/* Product Details */}
//                                             <div className="flex flex-col gap-1">
//                                                 <span className="text-gray-700 font-medium">
//                                                     {item.product?.name || "Product name not available"}
//                                                 </span>
//                                                 <span className="text-gray-500">
//                                                     Qty: {item.quantity || 0}
//                                                 </span>
//                                                 <span className="text-gray-500">
//                                                     Size: {item.size || 0}
//                                                 </span>
//                                                 <span className="text-gray-500 flex items-center gap-1">
//                                                     Color:{" "}
//                                                     {item.color ? (
//                                                         <span
//                                                             className="inline-block w-4 h-4 rounded-full border"
//                                                             style={{ backgroundColor: item.color }}
//                                                         />
//                                                     ) : (
//                                                         "Default"
//                                                     )}
//                                                 </span>
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>



//                                 {/* Status & Total */}
//                                 <div className="mt-auto">
//                                     <div className="text-xs mb-2">
//                                         <strong>Status:</strong>{" "}
//                                         <select
//                                             value={order.status}
//                                             onChange={(e) => handleStatusChange(order._id, e.target.value)}
//                                             className="border px-2 py-1 rounded-lg w-full text-xs focus:outline-none focus:ring focus:ring-blue-300"
//                                         >
//                                             <option value="Pending">Pending</option>
//                                             <option value="Accepted">Accepted</option>
//                                             <option value="Preparing">Preparing</option>
//                                             <option value="Shipped">Shipped</option>
//                                             <option value="Delivered">Delivered</option>
//                                             <option value="Cancelled">Cancelled</option>
//                                         </select>
//                                     </div>
//                                     <div className="font-bold text-sm text-gray-900">
//                                         Total: ₹{order.total || 0}
//                                     </div>
//                                 </div>
//                             </div>
//                         ))
//                     ) : (
//                         <p className="text-gray-500 text-center col-span-full">No orders found</p>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AdminOrders;


import { useEffect, useState } from "react";
import axios from "axios";
import { API } from "../constant";
import toast from "react-hot-toast";

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const token = JSON.parse(localStorage.getItem("auth"))?.token;

    const fetchOrders = async () => {
        try {
            const { data } = await axios.get(`${API}/order/admin/all`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (data.success) {
                setOrders(data.orders || []);
            } else {
                toast.error(data.message || "Failed to fetch orders");
            }
        } catch (error) {
            console.error("Error fetching admin orders", error);
            toast.error("Failed to load orders");
        }
    };

    const handleStatusChange = async (orderId, status) => {
        try {
            const { data } = await axios.put(
                `${API}/order/admin/status/${orderId}`,
                { status },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (data.success) {
                toast.success("Order status updated");
                fetchOrders();
            } else {
                toast.error(data.message || "Failed to update status");
            }
        } catch (err) {
            console.error("Error updating order status:", err);
            toast.error("Error updating order status");
        }
    };

    useEffect(() => {
        if (token) fetchOrders();
    }, [token]);

    return (
        <div className="w-full px-4 lg:px-8 py-6">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">All Orders (Admin View)</h1>

            <div className="">
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {orders.length > 0 ? (
                        orders.map((order, idx) => (
                            <div
                                key={order._id}
                                className="bg-white border border-gray-200 rounded-xl shadow-lg p-4 hover:shadow-xl transition-shadow duration-300 flex flex-col"
                            >
                                {/* Order Header */}
                                <div className="mb-2">
                                    <span className="text-sm text-gray-500">
                                        {new Date(order.createdAt).toLocaleString()}
                                    </span>
                                </div>

                                {/* User Info */}
                                <div className="text-xs text-gray-600 mb-3">
                                    {order.user ? (
                                        <>
                                            <p><strong>Customer:</strong> {order.user.fullName || order.user.name || "N/A"}</p>
                                            <p><strong>Email:</strong> {order.user.email || "N/A"}</p>
                                        </>
                                    ) : (
                                        <p className="text-red-500 font-medium">User info not available</p>
                                    )}
                                </div>

                                {/* Shipping Address (from order, not user profile) */}
                                <div className="text-xs text-gray-600 mb-3 bg-blue-50 p-2 rounded">
                                    <p className="font-semibold text-blue-800 mb-1">🚚 Delivery Address:</p>
                                    {order.shippingAddress ? (
                                        <>
                                            <p><strong>Phone:</strong> {order.shippingAddress.phone || "N/A"}</p>
                                            <p>
                                                <strong>Address:</strong>{" "}
                                                {[
                                                    order.shippingAddress.address,
                                                    order.shippingAddress.city,
                                                    order.shippingAddress.state,
                                                    order.shippingAddress.pincode,
                                                    order.shippingAddress.country
                                                ]
                                                    .filter(Boolean)
                                                    .join(", ")}
                                            </p>
                                        </>
                                    ) : (
                                        <p className="text-red-500">Shipping address not available</p>
                                    )}
                                </div>

                                {/* Order Items with Images */}
                                <div className="divide-y divide-gray-200 mb-3">
                                    {order.items?.map((item, i) => (
                                        <div
                                            key={item.product?._id + i}
                                            className="flex items-start gap-4 py-2 text-xs"
                                        >
                                            {/* Product Image */}
                                            {item.product?.images[0] ? (
                                                <img
                                                    src={`${API}${item.product.images[0].url}`}
                                                    alt={item.product.name}
                                                    className="w-32 h-32 object-contain rounded"
                                                />
                                            ) : (
                                                <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                                                    No Image
                                                </div>
                                            )}

                                            {/* Product Details */}
                                            <div className="flex flex-col gap-1">
                                                <span className="text-gray-700 font-medium">
                                                    {item.product?.name || "Product name not available"}
                                                </span>
                                                <span className="text-gray-500">
                                                    Qty: {item.quantity || 0}
                                                </span>
                                                {/* <span className="text-gray-500">
                                                    Size: {item.size || "Default"}
                                                </span> */}
                                                <span className="text-gray-500 flex items-center gap-1">
                                                    Color:{" "}
                                                    {item.color ? (
                                                        <span
                                                            className="inline-block w-4 h-4 rounded-full border"
                                                            style={{ backgroundColor: item.color }}
                                                        />
                                                    ) : (
                                                        "Default"
                                                    )}
                                                </span>
                                                <span className="text-green-600 font-medium">
                                                    ₹{item.price || 0}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Payment Method */}
                                <div className="text-xs text-gray-600 mb-2">
                                    <strong>Payment:</strong> {order.paymentMethod || "COD"}
                                </div>

                                {/* Status & Total */}
                                <div className="mt-auto">
                                    <div className="text-xs mb-2">
                                        <strong>Status:</strong>{" "}
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                            className="border px-2 py-1 rounded-lg w-full text-xs focus:outline-none focus:ring focus:ring-blue-300"
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Accepted">Accepted</option>
                                            <option value="Preparing">Preparing</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Delivered">Delivered</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    </div>
                                    <div className="font-bold text-sm text-gray-900">
                                        Total: ₹{order.total || 0}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center col-span-full">No orders found</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminOrders;