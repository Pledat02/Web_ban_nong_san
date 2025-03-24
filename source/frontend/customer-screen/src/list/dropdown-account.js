import React from "react";
import { UserPlus, LogIn, User, ClipboardList , LogOut } from "lucide-react";
import DropdownItem from "../components/dropdown";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const DropdownAccount = () => {
    const { user, logout } = useUser();
    const navigate = useNavigate();

    return (
        <div className="dropdown">
            <div tabIndex={0} className="cursor-pointer font-semibold text-white bg-green-600 rounded-md">
                Tài khoản
            </div>
            <ul tabIndex={0} className="dropdown-content right-0 mt-2 w-52 bg-white rounded-lg shadow-lg border border-gray-200 p-2">
                {user ? (
                    <div>
                        <div className="flex items-center space-x-3 w-full">
                            <img src={user.avatar || "https://tse4.mm.bing.net/th?id=OIP.ggX8e6U3YzyhPvp8qGZtQwHaHa&pid=Api&P=0&h=180"} alt="Avatar" className="w-10 h-10 rounded-full"/>
                            <div>
                                <p className="font-bold text-black truncate max-w-[140px]">{user.username}</p>
                                <p className="text-sm text-gray-800 truncate max-w-[140px]">{user.email}</p>
                            </div>
                        </div>
                        <DropdownItem icon={User} title="Hồ sơ" onClick={()=>navigate("/profile")}/>
                        <DropdownItem icon={ClipboardList} title="Lịch sử đặt hàng" onClick={()=>navigate("/order-history")}/>
                        <DropdownItem icon={LogOut} title="Đăng xuất" onClick={logout}/>
                    </div>
                ) : (
                    <div>
                        <DropdownItem icon={LogIn} title="Đăng nhập" onClick={() => navigate("/login")}/>
                        <DropdownItem icon={UserPlus} title="Đăng ký" onClick={() => navigate("/register")}/>
                    </div>
                )}
            </ul>
        </div>
    );
};

export default DropdownAccount;
