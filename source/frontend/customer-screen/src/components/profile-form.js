import React, { Component } from "react";
import { CheckCircleIcon, PencilIcon } from "@heroicons/react/24/solid";
import NotificationService from "../services/notification-service";
import ProfileService from "../services/profile-service";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddressForm from "./address-form";
import {useUser} from "../context/UserContext";

const withUser = (WrappedComponent) => {
    return (props) => {
        const { user } = useUser();
        return <WrappedComponent {...props} user={user} />;
    };
};

class ProfileForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editing: { firstName: false, lastName: false, phone: false, email: false },
            otpRequested: { phone: false, email: false },
            otpVerified: { phone: false, email: false },
        };

        this.handleEdit = this.handleEdit.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleSendOtp = this.handleSendOtp.bind(this);
        this.handleVerifyOtp = this.handleVerifyOtp.bind(this);
        this.isValidPhone = this.isValidPhone.bind(this);
    }

    isValidPhone(phone) {
        const phoneRegex = /^\d{9,10}$/;
        return phoneRegex.test(phone);
    }

    handleEdit(type) {
        this.setState((prevState) => ({
            editing: { ...prevState.editing, [type]: true },
        }));
    }

    async handleKeyDown(e, type) {
        if (e.key === "Enter") {
            e.preventDefault();
            try {
                await ProfileService.updateProfile(this.props.user.id_user, {
                    [type]: this.props.formData[type],
                });
                this.setState((prevState) => ({
                    editing: { ...prevState.editing, [type]: false },
                }));
            } catch (error) {
                toast.error("Cập nhật thất bại, vui lòng thử lại!");
            }
        }
    }

    async handleSendOtp(type) {
        let value = this.props.formData[type];

        if (type === "phone") {
            value = this.props.formData.phone;
            const phoneNumber = value.startsWith("+84") ? value.substring(3) : value;
            if (!this.isValidPhone(phoneNumber)) {
                toast.error("Số điện thoại không hợp lệ!");
                return;
            }
            value = `+84${phoneNumber}`;
            toast.success("Gửi OTP thành công", { position: "top-right" });
            await NotificationService.sendPhoneOtp(value);
        } else if (type === "email") {
            toast.success("Gửi OTP thành công", { position: "top-right" });
            await NotificationService.sendEmailOtp(value);
        }
        this.setState((prevState) => ({
            otpRequested: { ...prevState.otpRequested, [type]: true },
        }));
    }

    async handleVerifyOtp(type, otp) {
        if (otp.length !== 6) return;

        let success = false;
        const userId = this.props.user.id_user;
        let value = this.props.formData[type];

        if (type === "phone") {
            value = `+84${this.props.formData.phone.startsWith("+84") ? this.props.formData.phone.substring(3) : this.props.formData.phone}`;
            success = await NotificationService.verifyPhoneOtp(value, otp, userId);
        } else if (type === "email") {
            success = await NotificationService.verifyEmailOtp(value, otp, userId);
        }

        if (success) {
            this.setState((prevState) => ({
                otpRequested: { ...prevState.otpRequested, [type]: false },
                otpVerified: { ...prevState.otpVerified, [type]: true },
                editing: { ...prevState.editing, [type]: false },
            }));
        }
    }

    render() {
        const { formData, onChange, user } = this.props;
        const { editing, otpRequested, otpVerified } = this.state;

        return (
            <form className="space-y-8">
                <div className="space-y-6">
                    <h3 className="text-lg font-medium text-gray-900">Thông tin cá nhân</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Họ</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={onChange}
                                    disabled={!editing.firstName}
                                    onKeyDown={(e) => this.handleKeyDown(e, "firstName")}
                                    className={`mt-1 block w-full rounded-lg border px-3 py-2 shadow-sm pr-10 ${
                                        editing.firstName ? "border-green-500" : "bg-gray-100 cursor-not-allowed"
                                    }`}
                                />
                                {!editing.firstName && (
                                    <button
                                        type="button"
                                        onClick={() => this.handleEdit("firstName")}
                                        className="absolute inset-y-0 right-3 flex items-center"
                                    >
                                        <PencilIcon className="w-5 h-5 text-gray-500" />
                                    </button>
                                )}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tên</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={onChange}
                                    disabled={!editing.lastName}
                                    onKeyDown={(e) => this.handleKeyDown(e, "lastName")}
                                    className={`mt-1 block w-full rounded-lg border px-3 py-2 shadow-sm pr-10 ${
                                        editing.lastName ? "border-green-500" : "bg-gray-100 cursor-not-allowed"
                                    }`}
                                />
                                {!editing.lastName && (
                                    <button
                                        type="button"
                                        onClick={() => this.handleEdit("lastName")}
                                        className="absolute inset-y-0 right-3 flex items-center"
                                    >
                                        <PencilIcon className="w-5 h-5 text-gray-500" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                    <div className="relative flex items-center">
                        <span className="mt-1 px-3 py-2 border border-r-0 rounded-l-lg">+84</span>
                        <input
                            type="tel"
                            name="phone"
                            value={
                                formData.phone && formData.phone.startsWith("+84")
                                    ? formData.phone.substring(3)
                                    : formData.phone
                            }
                            onChange={(e) => {
                                const { value } = e.target;
                                onChange({ target: { name: "phone", value: `+84${value}` } });
                            }}
                            disabled={!editing.phone}
                            className={`mt-1 block w-full rounded-r-lg border px-3 py-2 shadow-sm pr-24 ${
                                editing.phone ? "border-green-500" : "bg-gray-100 cursor-not-allowed"
                            }`}
                        />
                        {!editing.phone ? (
                            <button
                                type="button"
                                onClick={() => this.handleEdit("phone")}
                                className="absolute inset-y-0 right-4 flex items-center"
                            >
                                <PencilIcon className="w-5 h-5 text-gray-500" />
                            </button>
                        ) : (
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 bg-gray-600 text-white px-3 py-1 rounded-lg hover:bg-gray-700 transition-colors"
                                onClick={() => this.handleSendOtp("phone")}
                            >
                                Gửi OTP
                            </button>
                        )}
                    </div>
                    {otpRequested.phone && (
                        <div className="mt-2 flex items-center space-x-2">
                            <input
                                type="text"
                                name="phoneOtp"
                                value={formData.phoneOtp}
                                onChange={(e) => {
                                    onChange(e);
                                    this.handleVerifyOtp("phone", e.target.value);
                                }}
                                className="w-full rounded-lg border px-3 py-2 shadow-sm"
                                placeholder="Nhập mã OTP"
                            />
                            {otpVerified.phone && <CheckCircleIcon className="w-6 h-6 text-green-500" />}
                        </div>
                    )}
                </div>
                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <div className="relative">
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={onChange}
                            disabled={!editing.email}
                            className={`mt-1 block w-full rounded-lg border px-3 py-2 shadow-sm pr-24 ${
                                editing.email ? "border-green-500" : "bg-gray-100 cursor-not-allowed"
                            }`}
                        />
                        {!editing.email ? (
                            <button
                                type="button"
                                onClick={() => this.handleEdit("email")}
                                className="absolute inset-y-0 right-4 flex items-center"
                            >
                                <PencilIcon className="w-5 h-5 text-gray-500" />
                            </button>
                        ) : (
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 bg-gray-600 text-white px-3 py-1 rounded-lg hover:bg-gray-700 transition-colors"
                                onClick={() => this.handleSendOtp("email")}
                            >
                                Gửi OTP
                            </button>
                        )}
                    </div>
                    {otpRequested.email && (
                        <div className="mt-2 flex items-center space-x-2">
                            <input
                                type="text"
                                name="emailOtp"
                                value={formData.emailOtp}
                                onChange={(e) => {
                                    onChange(e);
                                    this.handleVerifyOtp("email", e.target.value);
                                }}
                                className="w-full rounded-lg border px-3 py-2 shadow-sm"
                                placeholder="Nhập mã OTP"
                            />
                            {otpVerified.email && <CheckCircleIcon className="w-6 h-6 text-green-500" />}
                        </div>
                    )}
                </div>
                <AddressForm data={formData} onChange={onChange} />
            </form>
        );
    }
}

export default withUser(ProfileForm);