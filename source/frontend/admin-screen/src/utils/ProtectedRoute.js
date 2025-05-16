// src/components/ProtectedRoute.js
import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import AuthService from '../service/auth-service';
import {toast} from "react-toastify";

function ProtectedRoute({ children }) {
    const { user } = useUser();
    if (!user || AuthService.checkExpiredToken(user)) {
        toast.warn("Vui lòng đăng nhập !")
        return <Navigate to="/login" replace />;
    }
    return children;
}

export default ProtectedRoute;