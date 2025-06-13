import React, { useState, useEffect } from "react";
import { useCart, CartActionTypes } from "../context/cart-context";
import { useUser } from "../context/UserContext";
import ProfileService from "../services/profile-service";
import PaymentService from "../services/payment-service";
import OrderService from "../services/order-service";
import ShippingService from "../services/shipping-service";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ShoppingCart } from 'lucide-react';
import ShippingInformation from "../components/shipping-infor";
import PaymentMethod from "../components/payment-method";
import OrderSummary from "../components/order-summary";

const Checkout = () => {
    const { cart, getTotalPrice, dispatch } = useCart();
    const { user } = useUser();
    const navigate = useNavigate();
    const [shippingFee, setShippingFee] = useState(0);
    const [loading, setLoading] = useState(false);
    const [profileLoading, setProfileLoading] = useState(true);

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
            setProfileLoading(true);
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

                    const missingFields = [];
                    if (!profile.firstName) missingFields.push("Họ");
                    if (!profile.lastName) missingFields.push("Tên");
                    if (!profile.phone) missingFields.push("Số điện thoại");
                    if (!profile.email) missingFields.push("Email");
                    if (!profile.address?.province) missingFields.push("Tỉnh/Thành phố");
                    if (!profile.address?.district) missingFields.push("Quận/Huyện");
                    if (!profile.address?.ward) missingFields.push("Phường/Xã");

                    if (missingFields.length > 0) {
                        setLoading(true);
                        toast.warning(
                            <div>
                                Vui lòng cập nhật hồ sơ với các thông tin sau: {missingFields.join(", ")}.{" "}
                                <a
                                    href="/profile"
                                    onClick={(e) => {
                                        e.preventDefault(); // Prevent default anchor behavior
                                        navigate("/profile"); // Use react-router-dom navigation
                                    }}
                                    className="text-blue-600 underline hover:text-blue-800"
                                >
                                    Cập nhật hồ sơ
                                </a>
                            </div>,
                            {
                                autoClose: false,
                            }
                        );
                    }
                }
            } catch (error) {
                console.error("Lỗi khi tải thông tin hồ sơ:", error);
                toast.error("Không thể tải thông tin hồ sơ. Vui lòng thử lại sau.");
            } finally {
                setProfileLoading(false);
            }
        };

        fetchProfile();
    }, [navigate]);

    useEffect(() => {
        const calculateShipping = async () => {
            if (!formData.province || !formData.district || !formData.ward) return;

            setLoading(true);
            try {
                const shippingData = {
                    address: `${formData.hamlet}, ${formData.ward}, ${formData.district}, ${formData.province}`,
                    province: formData.province,
                    district: formData.district,
                    ward: formData.ward,
                    value: getTotalPrice(),
                    weight: cart.reduce((total, item) => total + (item.weight.weightType?.value || 0) * item.quantity, 0)
                };
                const fee = await ShippingService.getShippingFee(shippingData);
                setShippingFee(fee);
            } catch (error) {
                console.error("Lỗi khi tính phí vận chuyển:", error);
                toast.error("Không thể tính phí vận chuyển. Vui lòng thử lại sau.");
            } finally {
                setLoading(false);
            }
        };

        calculateShipping();
    }, [formData.province, formData.district, formData.ward, cart]);

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

        // Validate required profile fields
        const requiredFields = {
            firstName: "Họ",
            lastName: "Tên",
            phone: "Số điện thoại",
            email: "Email",
            province: "Tỉnh/Thành phố",
            district: "Quận/Huyện",
            ward: "Phường/Xã",
        };

        const missingFields = Object.keys(requiredFields).filter(
            (field) => !formData[field] || formData[field].trim() === ""
        );

        if (missingFields.length > 0) {
            const missingFieldNames = missingFields.map((field) => requiredFields[field]);
            toast.warning(
                `Vui lòng cập nhật hồ sơ với các thông tin sau: ${missingFieldNames.join(", ")}`,
                {
                    onClick: () => navigate("/profile"),
                    autoClose: false,
                }
            );
            return; // Stop submission if profile is incomplete
        }

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
                pick_money: formData.paymentMethod === 'cod' ? getTotalPrice() + shippingFee : 0,
                note: formData.notes || "",
                is_freeship: 0,
                payment_method: formData.paymentMethod,
                totalPrice: getTotalPrice(),
                value: getTotalPrice() + shippingFee,
                shipping_fee: shippingFee,
                orderItems: cart.map((item) => ({
                    name: item.name ?? "không xác định",
                    price: item.price,
                    weight: item.weight.weightType.value,
                    quantity: item.quantity,
                    image: item.image,
                    productCode: item.id || "",
                })),
            };

            if (formData.paymentMethod === "Vnpay") {
                localStorage.setItem("order", JSON.stringify(orderData));
                window.location.href = await PaymentService.CreatePaymentVNPay(getTotalPrice() + shippingFee);
            } else {
                toast.info("Đơn hàng đang được xử lý!", { position: "top-right" });
                await OrderService.createOrder(orderData);
                toast.success("Đặt hàng thành công!", { position: "top-right" });
                clearCart();
                navigate("/");
            }
        } catch (error) {
            console.error("Lỗi khi tạo thanh toán:", error);
            toast.error("Có lỗi xảy ra khi xử lý đơn hàng. Vui lòng thử lại.");
        }
    };

    const subtotal = getTotalPrice();

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                    <ShoppingCart className="w-8 h-8" />
                    Thanh toán
                </h1>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <ShippingInformation
                            formData={formData}
                            handleChange={handleChange}
                            isLoading={profileLoading}
                        />
                        <PaymentMethod
                            formData={formData}
                            handleChange={handleChange}
                        />
                    </div>

                    <div className="lg:col-span-1">
                        <OrderSummary
                            cart={cart}
                            subtotal={subtotal}
                            shippingFee={shippingFee}
                            loading={loading}
                            formData={formData}
                            handleChange={handleChange}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Checkout;