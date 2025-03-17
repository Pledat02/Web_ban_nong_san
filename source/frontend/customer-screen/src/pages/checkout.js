import React, { useState, useEffect } from "react";
import ProfileService from "../services/profile-service"; // Giả sử có API này để lấy Profile
import {toast} from "react-toastify";

const Checkout = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        province: "",
        district: "",
        ward: "",
        postalCode: "",
        hamlet: "",
        notes: "",
        paymentMethod: "bank_transfer",
    });

    useEffect(() => {
        async function fetchProfile() {
            try {
                const profile = await ProfileService.getMyProfile();
                if (profile) {
                    setFormData((prev) => ({
                        ...prev,
                        firstName: profile.firstName || "",
                        lastName: profile.lastName || "",
                        phone: profile.phone || "",
                        email: profile.email || "",
                        province: profile.province || "",
                        district: profile.district || "",
                        ward: profile.ward || "",
                        postalCode: profile.postalCode || "",
                        hamlet: profile.hamlet || "",
                    }));

                    if (!profile.province) {
                        toast.info("Bạn chưa có địa chỉ trong hồ sơ, vui lòng nhập thông tin.");
                    }
                }
            } catch (error) {
                console.error("Lỗi khi tải hồ sơ:", error);
            }
        }
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Order Submitted", formData);

        try {
            await ProfileService.updateProfile({
                address: {
                    province: formData.province,
                    district: formData.district,
                    ward: formData.ward,
                    postalCode: formData.postalCode,
                    hamlet: formData.hamlet,
                }
            });
            toast.success("Địa chỉ của bạn đã được cập nhật!");
        } catch (error) {
            console.error("Lỗi khi cập nhật địa chỉ:", error);
            toast.error("Cập nhật địa chỉ thất bại!");
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Thông Tin Thanh Toán</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" name="firstName" placeholder="Tên *" className="p-2 border rounded" value={formData.firstName} onChange={handleChange} required />
                <input type="text" name="lastName" placeholder="Họ *" className="p-2 border rounded" value={formData.lastName} onChange={handleChange} required />
                <input type="text" name="phone" placeholder="Số điện thoại *" className="p-2 border rounded" value={formData.phone} onChange={handleChange} required />
                <input type="email" name="email" placeholder="Địa chỉ email *" className="p-2 border rounded md:col-span-2" value={formData.email} onChange={handleChange} required />

                <input type="text" name="province" placeholder="Tỉnh / Thành phố *" className="p-2 border rounded" value={formData.province} onChange={handleChange} required />
                <input type="text" name="district" placeholder="Quận / Huyện *" className="p-2 border rounded" value={formData.district} onChange={handleChange} required />
                <input type="text" name="ward" placeholder="Phường / Xã *" className="p-2 border rounded" value={formData.ward} onChange={handleChange} required />
                <input type="text" name="postalCode" placeholder="Mã bưu điện (tùy chọn)" className="p-2 border rounded" value={formData.postalCode} onChange={handleChange} />
                <input type="text" name="hamlet" placeholder="Thôn / Xóm (tùy chọn)" className="p-2 border rounded md:col-span-2" value={formData.hamlet} onChange={handleChange} />

                <h2 className="text-2xl font-bold mt-6 md:col-span-2">Đơn Hàng Của Bạn</h2>
                <div className="md:col-span-2 bg-gray-100 p-4 rounded">
                    <p>Bơm mỹ x 1 - <strong>180.000₫</strong></p>
                    <p>Cà chua Đà Lạt x 1 - <strong>80.000₫</strong></p>
                    <hr className="my-2" />
                    <p>Tổng cộng: <strong>260.000₫</strong></p>
                </div>

                <div className="md:col-span-2 flex flex-col gap-2">
                    <label className="flex items-center gap-2">
                        <input type="radio" name="paymentMethod" value="bank_transfer" checked={formData.paymentMethod === "bank_transfer"} onChange={handleChange} />
                        Chuyển khoản ngân hàng
                    </label>
                    <label className="flex items-center gap-2">
                        <input type="radio" name="paymentMethod" value="cash_on_delivery" checked={formData.paymentMethod === "cash_on_delivery"} onChange={handleChange} />
                        Trả tiền mặt khi nhận hàng
                    </label>
                </div>

                <textarea name="notes" placeholder="Ghi chú đơn hàng (tùy chọn)" className="p-2 border rounded md:col-span-2" value={formData.notes} onChange={handleChange}></textarea>
                <button type="submit" className="bg-green-500 text-white p-2 rounded-md md:col-span-2">ĐẶT HÀNG</button>
            </form>
        </div>
    );
};

export default Checkout;
