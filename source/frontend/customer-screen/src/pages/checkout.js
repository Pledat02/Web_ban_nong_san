import React, { useState, useEffect } from "react";
import { useCart, CartActionTypes } from "../context/cart-context";
import { useUser } from "../context/UserContext";
import ProfileService from "../services/profile-service";
import PaymentService from "../services/payment-service";
import OrderService from "../services/order-service";
import { useNavigate } from "react-router-dom";
import {toast} from "react-toastify";

const Checkout = () => {
    const { cart, getTotalPrice, dispatch } = useCart();

    const { user } = useUser();
    const navigate = useNavigate();

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
        paymentMethod: "cod",
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const profile = await ProfileService.getMyProfile();

                if (profile) {
                    setFormData((prevFormData) => ({
                        ...prevFormData,
                        firstName: profile.firstName || "",
                        lastName: profile.lastName || "",
                        phone: profile.phone || "",
                        email: profile.email || "",
                        province: profile.address?.province || "",
                        district: profile.address?.district || "",
                        ward: profile.address?.ward || "",
                        postalCode: profile.address?.postalCode || "",
                        hamlet: profile.address?.hamlet || "",
                    }));
                    // Kiểm tra nếu có bất kỳ trường nào bị null hoặc rỗng
                    const missingFields = [];
                    if (!profile.firstName) missingFields.push("Tên");
                    if (!profile.lastName) missingFields.push("Họ");
                    if (!profile.phone) missingFields.push("Số điện thoại");
                    if (!profile.email) missingFields.push("Email");
                    if (!profile.address?.province) missingFields.push("Tỉnh / Thành phố");
                    if (!profile.address?.district) missingFields.push("Quận / Huyện");
                    if (!profile.address?.ward) missingFields.push("Phường / Xã");

                    if (missingFields.length > 0) {
                        toast.warning(`Vui lòng cập nhật đầy đủ thông tin hồ sơ trước: ${missingFields.join(", ")}`);
                    }
                }
            } catch (error) {
                console.error("Lỗi khi tải hồ sơ:", error);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const clearCart = () => {
        dispatch({ type: CartActionTypes.CLEAR_CART });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let orderData = {
                id_user: user.id_user,
                name: `${formData.firstName} ${formData.lastName}`,
                province: formData.province,
                district: formData.district,
                ward: formData.ward,
                hamlet: formData.hamlet || "",
                tel: formData.phone,
                address: `${formData.hamlet}, ${formData.ward}, ${formData.district}, ${formData.province}`,
                pick_money: 0,
                note: formData.notes || "",
                is_freeship: 0,
                pick_option: formData.paymentMethod,
                value: getTotalPrice(),
                orderItems: cart.map((item) => ({
                    name: item.name ?? "unknown",
                    price: item.price,
                    weight: item.weight.weight,
                    quantity: item.quantity,
                    productCode: item.id || "",
                })),
            };

            if (formData.paymentMethod === "none") {
                // Thanh toán online
                localStorage.setItem("order", JSON.stringify(orderData));
                window.location.href = await PaymentService.CreatePaymentVNPay(getTotalPrice());
            } else {
                // Thanh toán khi nhận hàng
                 OrderService.createOrder(orderData);
                clearCart();
                navigate("/");
            }
        } catch (error) {
            console.error("Lỗi khi tạo thanh toán:", error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Thông Tin Thanh Toán</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" readOnly name="firstName" placeholder="Tên *" className="p-2 border rounded" value={formData.firstName} onChange={handleChange} required />
                <input type="text" readOnly name="lastName" placeholder="Họ *" className="p-2 border rounded" value={formData.lastName} onChange={handleChange} required />
                <input type="text" readOnly name="phone" placeholder="Số điện thoại *" className="p-2 border rounded" value={formData.phone} onChange={handleChange} required />
                <input type="email" readOnly name="email" placeholder="Địa chỉ email *" className="p-2 border rounded md:col-span-2" value={formData.email} onChange={handleChange} required />

                <input type="text" readOnly name="province" placeholder="Tỉnh / Thành phố *" className="p-2 border rounded" value={formData.province} onChange={handleChange} required />
                <input type="text" readOnly name="district" placeholder="Quận / Huyện *" className="p-2 border rounded" value={formData.district} onChange={handleChange} required />
                <input type="text" readOnly name="ward" placeholder="Phường / Xã *" className="p-2 border rounded" value={formData.ward} onChange={handleChange} required />
                <input type="text" readOnly name="postalCode" placeholder="Mã bưu điện (tùy chọn)" className="p-2 border rounded" value={formData.postalCode} onChange={handleChange} />
                <input type="text" readOnly name="hamlet" placeholder="Thôn / Xóm (tùy chọn)" className="p-2 border rounded md:col-span-2" value={formData.hamlet} onChange={handleChange} />

                <h2 className="text-2xl font-bold mt-6 md:col-span-2">Đơn Hàng Của Bạn</h2>
                <div className="md:col-span-2 bg-gray-100 p-4 rounded">
                    {cart.length === 0 ? (
                        <p>Giỏ hàng của bạn đang trống.</p>
                    ) : (
                        <>
                            {cart.map((item) => (
                                <p key={item.id}>
                                    {item.name} x {item.quantity} - <strong>{item.price * item.quantity}₫</strong>
                                </p>
                            ))}
                            <hr className="my-2" />
                            <p>Tổng cộng: <strong>{getTotalPrice()}₫</strong></p>
                        </>
                    )}
                </div>

                <div className="md:col-span-2 flex flex-col gap-2">
                    <label className="flex items-center gap-2">
                        <input type="radio" name="paymentMethod" value="none" checked={formData.paymentMethod === "none"} onChange={handleChange} />
                        Chuyển khoản ngân hàng
                    </label>
                    <label className="flex items-center gap-2">
                        <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === "cod"} onChange={handleChange} />
                        Trả tiền mặt khi nhận hàng
                    </label>
                </div>

                <textarea name="notes" placeholder="Ghi chú đơn hàng (tùy chọn)" className="p-2 border rounded md:col-span-2" value={formData.notes} onChange={handleChange}></textarea>
                <button type="submit" className="bg-green-500 text-white p-2 rounded-md md:col-span-2">
                    ĐẶT HÀNG
                </button>
            </form>
        </div>
    );
};

export default Checkout;
