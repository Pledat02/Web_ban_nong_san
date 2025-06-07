import React, { Component } from "react";
import { ProfileSidebar } from "../components/profile-sidebar";
import  ProfileForm  from "../components/profile-form";
import ProfileService from "../services/profile-service";
import { toast } from "react-toastify";

class MyProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formData: {
                firstName: "",
                lastName: "",
                phone: "",
                email: "",
                province: "",
                district: "",
                ward: "",
                postalCode: "",
                hamlet: "",
            },
        };

        // Bind các phương thức
        this.handleChange = this.handleChange.bind(this);
        this.fetchProfile = this.fetchProfile.bind(this);
    }

    // Thay thế useEffect để lấy dữ liệu profile
    componentDidMount() {
        this.fetchProfile();
    }

    async fetchProfile() {
        try {
            if (localStorage.getItem("user") == null) {
                toast.info("Người dùng chưa đăng nhập");
                return;
            }
            const profileData = await ProfileService.getMyProfile();

            if (profileData) {
                this.setState({
                    formData: {
                        firstName: profileData.firstName || "",
                        lastName: profileData.lastName || "",
                        phone: profileData.phone || "",
                        email: profileData.email || "",
                        province: profileData.address?.province || "",
                        district: profileData.address?.district || "",
                        ward: profileData.address?.ward || "",
                        postalCode: profileData.address?.postalCode || "",
                        hamlet: profileData.address?.hamlet || "",
                    },
                });
            }
        } catch (error) {
            console.error("Lỗi khi lấy thông tin cá nhân:", error);
        }
    }

    // Hàm xử lý thay đổi input
    handleChange(e) {
        const { name, value } = e.target;
        this.setState((prevState) => ({
            formData: {
                ...prevState.formData,
                [name]: value,
            },
        }));
    }

    render() {
        const { formData } = this.state;

        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-2xl shadow">
                        <div className="grid grid-cols-1 md:grid-cols-4">
                            <ProfileSidebar />
                            <div className="col-span-3 p-8">
                                <ProfileForm
                                    formData={formData}
                                    onChange={this.handleChange}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default MyProfile;