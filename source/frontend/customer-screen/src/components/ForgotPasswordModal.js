import React, { useState } from 'react';
import NotificationService from '../services/notification-service';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';

const ForgotPasswordModal = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [step, setStep] = useState('email');

    const handleSendOtp = async () => {
        if (!email) {
            toast.error('Vui lòng nhập email!');
            return;
        }
        const success = await NotificationService.sendForgotPasswordOtp(email);
        if (success) {
            setStep('otp');
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp) {
            toast.error('Vui lòng nhập mã OTP!');
            return;
        }
        const success = await NotificationService.verifyForgotPasswordOtp(email, otp);
        if (success) {
            setStep('password');
        }
    };

    const handleUpdatePassword = async () => {
        if (!newPassword || !confirmPassword) {
            toast.error('Vui lòng nhập đầy đủ thông tin!');
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error('Mật khẩu xác nhận không khớp!');
            return;
        }
        const success = await NotificationService.updatePassword(newPassword, otp);
        if (success) {
            onClose();
            setStep('email');
            setEmail('');
            setOtp('');
            setNewPassword('');
            setConfirmPassword('');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 relative">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
                >
                    <X size={20} />
                </button>

                <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
                    {step === 'email' && 'Quên mật khẩu'}
                    {step === 'otp' && 'Xác thực OTP'}
                    {step === 'password' && 'Đặt lại mật khẩu'}
                </h2>

                {step === 'email' && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="Nhập email của bạn"
                            />
                        </div>
                        <button
                            onClick={handleSendOtp}
                            className="w-full p-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300"
                        >
                            Gửi mã OTP
                        </button>
                    </div>
                )}

                {step === 'otp' && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Mã OTP
                            </label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="Nhập mã OTP"
                                maxLength={6}
                            />
                        </div>
                        <button
                            onClick={handleVerifyOtp}
                            className="w-full p-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300"
                        >
                            Xác thực OTP
                        </button>
                        <button
                            onClick={handleSendOtp}
                            className="w-full p-2 border border-green-600 text-green-600 rounded-md hover:bg-green-50 transition duration-300"
                        >
                            Gửi lại mã OTP
                        </button>
                    </div>
                )}

                {step === 'password' && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Mật khẩu mới
                            </label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="Nhập mật khẩu mới"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Xác nhận mật khẩu
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="Xác nhận mật khẩu mới"
                            />
                        </div>
                        <button
                            onClick={handleUpdatePassword}
                            className="w-full p-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300"
                        >
                            Cập nhật mật khẩu
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForgotPasswordModal;