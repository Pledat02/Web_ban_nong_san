import React, { useState } from "react";
import { auth, googleProvider, facebookProvider } from "./firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import "./login.css"; // Import CSS

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Normal Login
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            alert("Login successful!");
        } catch (error) {
            alert(error.message);
        }
    };

    // Google Login
    const handleGoogleLogin = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            alert("Google login successful!");
        } catch (error) {
            alert(error.message);
        }
    };

    // Facebook Login
    const handleFacebookLogin = async () => {
        try {
            await signInWithPopup(auth, facebookProvider);
            alert("Facebook login successful!");
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="login-container">
            <h2>ĐĂNG NHẬP</h2>
            <form onSubmit={handleLogin}>
                <label>Email hoặc Tên tài khoản</label>
                <input
                    type="email"
                    placeholder="Nhập email của bạn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <label>Mật khẩu</label>
                <input
                    type="password"
                    placeholder="Nhập mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button type="submit" className="btn-login">ĐĂNG NHẬP</button>
            </form>

            <div className="social-login">
                <button onClick={handleGoogleLogin} className="google-btn">Đăng nhập với Google</button>
                <button onClick={handleFacebookLogin} className="facebook-btn">Đăng nhập với Facebook</button>
            </div>

            <p className="forgot-password">Quên mật khẩu?</p>
        </div>
    );
};

export default Login;
