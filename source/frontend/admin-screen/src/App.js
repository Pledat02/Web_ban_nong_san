// src/App.js
import { BrowserRouter as Router } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import AppRoutes from './route/route-config';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
    return (
        <UserProvider>
            <Router>
                <AppRoutes />
                <ToastContainer />
            </Router>
        </UserProvider>
    );
}

export default App;