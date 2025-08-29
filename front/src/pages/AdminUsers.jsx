// src/pages/AdminUsers.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API } from "../constant";

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = JSON.parse(localStorage.getItem("auth"))?.token;
                const res = await axios.get(`${API}/order/admin/users`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                // Sort by totalPurchase descending
                const sortedUsers = res.data.users.sort(
                    (a, b) => b.totalPurchase - a.totalPurchase
                );

                setUsers(sortedUsers);
            } catch (err) {
                console.error("Failed to fetch users", err);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);


    if (loading) {
        return <div className="text-center py-10">Loading users...</div>;
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Registered Users</h1>

            {users.length === 0 ? (
                <p>No registered users found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                            <tr className="bg-gray-100 text-left">
                                <th className="py-2 px-4 border-b">#</th>
                                <th className="py-2 px-4 border-b">Name</th>
                                <th className="py-2 px-4 border-b">Email</th>
                                <th className="py-2 px-4 border-b">Total Purchase</th>
                                <th className="py-2 px-4 border-b">Joined</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u, index) => (
                                <tr key={u._id} className="hover:bg-gray-50">
                                    <td className="py-2 px-4 border-b">{index + 1}</td>
                                    <td className="py-2 px-4 border-b">{u.name}</td>
                                    <td className="py-2 px-4 border-b">{u.email}</td>
                                    <td className="py-2 px-4 border-b">
                                        ₹{u.totalPurchase.toLocaleString()}
                                    </td>
                                    <td className="py-2 px-4 border-b">
                                        {new Date(u.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;
