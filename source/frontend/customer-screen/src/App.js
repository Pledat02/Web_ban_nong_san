import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import './App.css';

import AppRoutes from "./route/route-config";
import {UserProvider} from "./context/UserContext";
import {CartProvider} from "./context/cart-context";
import {ToastContainer} from "react-toastify";
const App = () => {
    return (
        <UserProvider>
            <CartProvider>
                <Router>
                    <AppRoutes />
                    <ToastContainer/>
                </Router>
            </CartProvider>
        </UserProvider>
    );
};

export default App;

