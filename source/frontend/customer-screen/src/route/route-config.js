import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/home";
import Login from "../pages/login";
import MainLayout from "../components/main-layout";
const AppRoutes = () => {
    return (
        <Routes>
            {/* Các route có Header và Footer */}
            <Route path="/" element={<MainLayout/>}>
                <Route index element={<Home/>} />
                <Route path="login" element={<Login />} />
            </Route>
            {/* Route không cần Header/Footer */}
            {/*<Route path="*" element={<NotFound/>} />*/}
        </Routes>
    );
};
export default AppRoutes;
