import React, { useEffect } from "react";
import { BrowserRouter as Router, useNavigate } from "react-router-dom";
import './App.css';

import AppRoutes from "./route/route-config";
import { UserProvider } from "./context/UserContext";
import { CartProvider } from "./context/cart-context";
import {toast, ToastContainer} from "react-toastify";
import authService from "./services/auth-service";

const isTokenExpiringSoon = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.token) return true;

    const decodedToken = JSON.parse(atob(user.token.split(".")[1]));
    const now = Math.floor(Date.now() / 1000);
    return decodedToken.exp - now < 300;
};


const App = () => {
    return (
        <UserProvider>
            <CartProvider>
                <Router>
                    <TokenCheck />
                    <AppRoutes />
                    <ToastContainer/>
                </Router>
            </CartProvider>
        </UserProvider>
    );
};

const TokenCheck = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const refreshAccessToken = async () => {
            const user = JSON.parse(localStorage.getItem("user"));

            if (user && user.token) {
                if(authService.checkExpiredToken(user.token)){
                    localStorage.removeItem("user");
                    toast.info("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!")
                    return;
                }

                if(isTokenExpiringSoon()){
                    try {
                        const newToken = await authService.refreshToken(user.token);
                        user.token = newToken;
                        console.log(newToken)
                        localStorage.setItem("user", JSON.stringify(user));
                    } catch (error) {
                        console.error("Lỗi refresh token:", error);
                        // Nếu refresh thất bại → logout
                        localStorage.removeItem("user");
                        navigate("/login");
                    }
                }
            }
        };

        // Kiểm tra ngay khi component mount
        refreshAccessToken();

        // Thiết lập interval để kiểm tra & refresh token mỗi 2 phút
        const interval = setInterval(() => {
            refreshAccessToken();
        }, 120000); // 120000 ms = 2 phút

        return () => clearInterval(interval);
    }, [navigate]);

    return null;
};


export default App;
