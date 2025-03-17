import React, { useState, useEffect } from "react";
import { ProfileSidebar } from "../components/profile-sidebar";
import { ProfileForm } from "../components/profile-form";
import ProfileService from "../services/profile-service";
import {toast} from "react-toastify";

const MyProfile = () => {
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
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                if(localStorage.getItem("user")==null){
                    toast.info("Người dùng chưa đăng nhập")
                    return;
                }
                const profileData = await ProfileService.getMyProfile();

                if (profileData) {
                    setFormData({
                        firstName: profileData.firstName || "",
                        lastName: profileData.lastName || "",
                        phone: profileData.phone || "",
                        email: profileData.email || "",
                        province: profileData.address.province || "",
                        district: profileData.address.district || "",
                        ward: profileData.address.ward || "",
                        postalCode: profileData.address.postalCode || "",
                        hamlet: profileData.address.hamlet || "",
                    });
                }
            } catch (error) {
                console.error("Lỗi khi lấy thông tin cá nhân:", error);
            }
            }

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };




    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <div className="bg-white rounded-2xl shadow">
                    <div className="grid grid-cols-1 md:grid-cols-4">
                        <ProfileSidebar />

                        <div className="col-span-3 p-8">
                            <ProfileForm
                                formData={formData}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyProfile;
