import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import './App.css';

import AppRoutes from "./route/route-config";
import {UserProvider} from "./context/UserContext";
const App = () => {
    return (
        <UserProvider>
            <Router>
                <AppRoutes />
            </Router>
        </UserProvider>
    );
};

export default App;

