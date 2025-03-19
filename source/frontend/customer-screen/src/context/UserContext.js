import { createContext, useContext, useEffect, useState } from "react";
import authService from "../services/auth-service";

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
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
    };

    // Hàm đăng xuất
    const logout = async () => {
        const token = JSON.parse(localStorage.getItem("user")).token;
        await authService.logout(token);
        setUser(null);
    };
    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
