import React, { useEffect } from "react";
import { BrowserRouter as Router, useNavigate } from "react-router-dom";
import './App.css';

import AppRoutes from "./route/route-config";
import { UserProvider } from "./context/UserContext";
import { CartProvider } from "./context/cart-context";
import {toast, ToastContainer} from "react-toastify";
import jwtDecode from "jwt-decode";

const checkExpiredToken = () => {
    const userData = localStorage.getItem("user");
    if (userData) {
        try {
            const parsedData = JSON.parse(userData);
            const token = parsedData.token;
            if (!token) return true;

            const decodedToken = jwtDecode(token);
            return new Date(decodedToken.exp * 1000) < new Date();
        } catch (error) {
            console.error("Lỗi khi giải mã token:", error);
            return true;
        }
    }
    return true;
};

const App = () => {
    return (
        <UserProvider>
            <CartProvider>
                <Router>
                    <TokenCheck />
                    <AppRoutes />
                    <ToastContainer />
                </Router>
            </CartProvider>
        </UserProvider>
    );
};

// Kiểm tra token & điều hướng nếu hết hạn
const TokenCheck = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if (checkExpiredToken()) {
            localStorage.removeItem('user');
        }
    }, [navigate]);

    return null; // Không render gì cả
};

export default App;
