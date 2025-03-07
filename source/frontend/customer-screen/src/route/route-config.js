import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/home";
import Login from "../pages/login";
import MainLayout from "../components/main-layout";
import ProductDetail from "../pages/product-detail";
import Register from "../pages/register";
import SearchPage from "../pages/search-product";
import Cart from "../pages/cart";
const AppRoutes = () => {
    return (
        <Routes>
            {/* Các route có Header và Footer */}
            <Route path="/" element={<MainLayout/>}>
                <Route index element={<Home/>} />
                <Route path="home"  element={<Home/>} />
                <Route path="product-detail/:id" element={<ProductDetail/>} />
                <Route path="login" element={<Login />} />
                <Route path="cart" element={<Cart/>} />
                <Route path="register" element={<Register/>} />
                <Route path="search" element={<SearchPage/>} />
            </Route>
            {/* Route không cần Header/Footer */}
            {/*<Route path="*" element={<NotFound/>} />*/}
        </Routes>
    );
};
export default AppRoutes;
