
import axios from "axios";
import { useState, useEffect, useContext, createContext } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        user: null,
        token: "",
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const data = localStorage.getItem("auth");
        if (data) {
            const parseData = JSON.parse(data);
            setAuth({
                user: parseData.user,
                token: parseData.token,
            });
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        if (auth?.token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${auth.token}`;
        }
    }, [auth.token]);

    // ✅ NEW: Clear guest likes after login
    useEffect(() => {
        if (auth?.token) {
            localStorage.removeItem("likedProducts");
        }
    }, [auth?.token]);

    return (
        <AuthContext.Provider value={[auth, setAuth, loading]}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

const useAuth = () => useContext(AuthContext);

export { useAuth, AuthProvider };
