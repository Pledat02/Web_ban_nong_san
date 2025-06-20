import { createContext, useContext, useEffect, useState } from "react";
import authService from "../services/auth-service";
import {toast} from "react-toastify";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    // Hàm đăng nhập
    const login = (userData) => {
        toast.success("Đăng nhập thành công")
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
    };

    // Hàm đăng xuất
    const logout = async () => {
        const user = JSON.parse(localStorage.getItem("user"))
        if (user) {
            await authService.logout(user.token);
        }
        setUser(null);
    };
    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
