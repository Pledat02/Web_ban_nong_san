import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {auth, googleProvider, facebookProvider} from "../utils/firebase";
import { signInWithPopup } from "firebase/auth";
import AuthService from "../services/auth-service";
import jwtDecode from "jwt-decode";
import { useUser } from "../context/UserContext";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { Link } from "react-router-dom";
import {toast} from "react-toastify";
import ForgotPasswordModal from "../components/ForgotPasswordModal";
const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { login } = useUser();
    const [isModalOpen, setIsModalOpen] = useState(false);
    // Đăng nhập bằng tài khoản thường
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await AuthService.login(email, password);
            if (response.authenticated) {
                const decoded = jwtDecode(response.token);
                const user = {
                    id_user: decoded.id_user,
                    username: decoded.sub,
                    email: decoded.email,
                    avatar: decoded.picture,
                    token: response.token,
                };
                login(user);
                navigate("/home");
            } else if (response.authenticated===false) {
                toast.error("Mật khẩu không đúng", { position: "top-right" });
            }
        } catch (error) {
            toast.error(error.message, { position: "top-right" });
        }
    };

    // Đăng nhập bằng Google
    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth,googleProvider);
            console.log(result)
            const userGG = result._tokenResponse;
            if(result.user.email ===null){
                toast.info("Tài khoản chưa xác thực email")
                return
            }
            const user = {
                username: userGG.displayName,
                email: result.user.email,
                phone: result.user.phoneNumber,
                password:result.user.uid,
                firstname:userGG.firstName,
                lastname: userGG.lastName,
                avatar: userGG.photoUrl,
                loginType: "google"
            };
            console.log(user)
            const response = await AuthService.loginSocial(user);
            const decoded = jwtDecode(response.token);
            const storedUser = {
                id_user: decoded.id_user,
                username: userGG.displayName,
                email: userGG.email,
                avatar: userGG.photoURL,
                token: response.token,

            };
            login(storedUser);
            navigate("/home");
        } catch (error) {
            toast.error(error.message, { position: "top-right" });
        }
    };

    // Đăng nhập bằng Facebook
    const handleFacebookLogin = async () => {
        try {
            const result = await signInWithPopup(auth,facebookProvider);
            const userFB = result._tokenResponse;
            if(userFB.email ===null){
                toast.info("Tài khoản chưa xác thực email")
                return
            }
            const user = {
                username: userFB.displayName,
                email: userFB.email,
                phone: result.user.phoneNumber,
                password:result.user.uid,
                firstname:userFB.firstName,
                lastname: userFB.lastName,
                avatar: userFB.photoURL,
                loginType: "facebook"
            };
            const response = await AuthService.loginSocial(user);
            const decoded = jwtDecode(response.token);
            const storedUser = {
                id_user: decoded.id_user,
                username: userFB.displayName,
                email: userFB.email,
                avatar: userFB.photoURL,
                token: response.token,

            };
            login(storedUser);
            navigate("/home");
        } catch (error) {
            toast.error(error.message, { position: "top-right" });
        }
    };

    return (
        <div className="w-full items-center justify-center mb-8 mx-auto max-w-md bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">ĐĂNG NHẬP</h2>
            <form onSubmit={handleLogin} className="space-y-4">
                <div>
                    <label className="block text-sm font-semibold text-gray-600">
                        Email hoặc Tên tài khoản
                    </label>
                    <input
                        type="email"
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Nhập email của bạn"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-600">Mật khẩu</label>
                    <input
                        type="password"
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Nhập mật khẩu"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full p-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300"
                >
                    ĐĂNG NHẬP
                </button>
            </form>

            <div className="flex items-center my-4">
                <div className="flex-1 border-t border-gray-300"></div>
                <p className="px-2 text-gray-500 text-sm">Hoặc đăng nhập bằng</p>
                <div className="flex-1 border-t border-gray-300"></div>
            </div>

            <div className="space-y-2">
                <button
                    onClick={handleGoogleLogin}
                    className="w-full flex items-center justify-center p-2 border border-gray-300 rounded-md bg-white hover:bg-gray-100 transition duration-300"
                >
                    <FcGoogle className="text-xl mr-2"/>
                    Đăng nhập với Google
                </button>
                <button
                    onClick={handleFacebookLogin}
                    className="w-full flex items-center justify-center p-2 border border-gray-300 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition duration-300"
                >
                    <FaFacebook className="text-xl mr-2"/>
                    Đăng nhập với Facebook
                </button>
            </div>

            <button
                onClick={() => setIsModalOpen(true)}
                className="mt-4 text-sm text-blue-500 text-center cursor-pointer hover:underline w-full"
            >
                Quên mật khẩu?
            </button>

            <ForgotPasswordModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
            <p className="mt-4 text-sm text-center">
                Chưa có tài khoản?{" "}
                <Link to="/register" className="text-blue-500 hover:underline">
                    Đăng ký ngay
                </Link>
            </p>
        </div>
    );
};

export default Login;
