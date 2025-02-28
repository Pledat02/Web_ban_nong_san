import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import './App.css';

import AppRoutes from "./route/route-config";
const App = () => {
    return (
        <Router>
            <AppRoutes />
        </Router>
    );
};

export default App;

