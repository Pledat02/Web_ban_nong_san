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
                    if (!profile.firstName) missingFields.push("First Name");
                    if (!profile.lastName) missingFields.push("Last Name");
                    if (!profile.phone) missingFields.push("Phone Number");
                    if (!profile.email) missingFields.push("Email");
                    if (!profile.address?.province) missingFields.push("Province/City");
                    if (!profile.address?.district) missingFields.push("District");
                    if (!profile.address?.ward) missingFields.push("Ward");

                    if (missingFields.length > 0) {
                        toast.warning(`Please update your profile with the following information: ${missingFields.join(", ")}`);
                    }
                }
            } catch (error) {
                console.error("Error loading profile:", error);
                toast.error("Could not load profile information. Please try again later.");
            } finally {
                setProfileLoading(false);
            }
        };

        fetchProfile();
    }, []);

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
                    weight: cart.reduce((total, item) => total + (item.weight?.weight || 0) * item.quantity, 0)
                };
                const fee = await ShippingService.getShippingFee(shippingData);
                setShippingFee(fee);
            } catch (error) {
                console.error("Error calculating shipping fee:", error);
                toast.error("Could not calculate shipping fee. Please try again later.");
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
                value: getTotalPrice() + shippingFee,
                shipping_fee: shippingFee,
                orderItems: cart.map((item) => ({
                    name: item.name ?? "unknown",
                    price: item.price,
                    weight: item.weight.weight,
                    quantity: item.quantity,
                    image: item.image,
                    productCode: item.id || "",
                })),
            };

            if (formData.paymentMethod === "none") {
                localStorage.setItem("order", JSON.stringify(orderData));
                window.location.href = await PaymentService.CreatePaymentVNPay(getTotalPrice() + shippingFee);
            } else {
                toast.success("Order placed successfully!", {position: "top-right"});
                OrderService.createOrder(orderData);
                clearCart();
                navigate("/");
            }
        } catch (error) {
            console.error("Error creating payment:", error);
            toast.error("An error occurred while processing your order. Please try again.");
        }
    };

    const subtotal = getTotalPrice();

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                    <ShoppingCart className="w-8 h-8" />
                    Checkout
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