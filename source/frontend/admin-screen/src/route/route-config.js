import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Orders from "../pages/Orders";
import Products from "../pages/products";
import User from "../pages/users";
import Roles from "../pages/roles";
import MainLayout from "../layout/main-layout";

const AppRoutes = () => {
    return (
        <Routes>
            {/* Các route có Header và Footer */}
            <Route path="/" element={<MainLayout/> }>
                <Route index element={<Dashboard/>} />
                <Route path="orders-management" element={<Orders/>} />
                <Route path="products-management" element={<Products/>} />
                <Route path="users-management" element={<User/>} />
                <Route path="roles-management" element={<Roles/>} />
                {/*<Route path="product-detail/:id" element={<ProductDetail/>} />*/}
                {/*<Route path="login" element={<Login />} />*/}
                {/*<Route path="profile" element={<MyProfile/>} />*/}
            </Route>
            {/* Route không cần Header/Footer */}
            {/*<Route path="*" element={<NotFound/>} />*/}
        </Routes>
    );
};
export default AppRoutes;
