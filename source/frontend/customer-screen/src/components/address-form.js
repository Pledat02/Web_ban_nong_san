    import React, { useState } from "react";
    import { toast } from "react-toastify";
    import "react-toastify/dist/ReactToastify.css";
    import addressData from "../data/address.json";
    import ProfileService from "../services/profile-service";

    export function AddressForm({ data, onChange }) {
        const [selectedProvince, setSelectedProvince] = useState("");
        const [selectedDistrict, setSelectedDistrict] = useState("");
        const [districts, setDistricts] = useState([]);
        const [wards, setWards] = useState([]);

        // Kiểm tra dữ liệu trước khi gửi
        const validateForm = () => {
            if (!selectedProvince) {
                toast.error("Vui lòng chọn tỉnh/thành phố!");
                return false;
            }
            if (!selectedDistrict) {
                toast.error("Vui lòng chọn quận/huyện!");
                return false;
            }
            if (!data.ward) {
                toast.error("Vui lòng chọn phường/xã!");
                return false;
            }
            if (!data.postalCode.trim()) {
                toast.error("Vui lòng nhập mã bưu chính!");
                return false;
            }
            if (!data.hamlet.trim()) {
                toast.error("Vui lòng nhập thôn/ấp!");
                return false;
            }
            return true;
        };

        // Gửi dữ liệu lên server
        const handleSubmit = async (e) => {
            e.preventDefault();
            if (!validateForm()) return;

            try {
                console.log("Form submitted:", data);
                await ProfileService.updateProfile(data);
                toast.success("Cập nhật thông tin thành công!");
            } catch (error) {
                console.error("Update failed:", error);
                toast.error("Cập nhật thất bại, vui lòng thử lại!");
            }
        };

        const handleProvinceChange = (e) => {
            const provinceName = e.target.value;
            setSelectedProvince(provinceName);
            const province = addressData.province.find(p => p.name === provinceName);
            setDistricts(province ? province.district : []);
            setSelectedDistrict("");
            setWards([]);
            onChange({ target: { name: "province", value: provinceName } });
        };

        const handleDistrictChange = (e) => {
            const districtName = e.target.value;
            setSelectedDistrict(districtName);
            const district = districts.find(d => d.name === districtName);
            setWards(district ? district.ward : []);
            onChange({ target: { name: "district", value: districtName } });
        };

        return (
            <form onSubmit={handleSubmit} className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Thông tin địa chỉ</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Chọn Tỉnh/Thành phố */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Tỉnh/Thành phố <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="province"
                            value={selectedProvince}
                            onChange={handleProvinceChange}
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:ring-blue-500"
                            required
                        >
                            <option value="">Chọn tỉnh/thành phố</option>
                            {addressData.province.map((p) => (
                                <option key={p.name} value={p.name}>{p.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Chọn Quận/Huyện */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Quận/Huyện <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="district"
                            value={selectedDistrict}
                            onChange={handleDistrictChange}
                            disabled={!districts.length}
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:ring-blue-500"
                            required
                        >
                            <option value="">Chọn quận/huyện</option>
                            {districts.map((d) => (
                                <option key={d.name} value={d.name}>{d.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Chọn Phường/Xã */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Phường/Xã <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="ward"
                            value={data.ward}
                            onChange={onChange}
                            disabled={!wards.length}
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:ring-blue-500"
                            required
                        >
                            <option value="">Chọn phường/xã</option>
                            {wards.map((w, index) => (
                                <option key={index} value={w}>{w}</option>
                            ))}
                        </select>
                    </div>

                    {/* Mã Bưu Chính */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Mã bưu chính <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="postalCode"
                            value={data.postalCode}
                            onChange={onChange}
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Thôn/Ấp */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Thôn/Ấp <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="hamlet"
                            value={data.hamlet}
                            onChange={onChange}
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:ring-blue-500"
                            required
                        />
                    </div>
                </div>
                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                        Cập nhật địa chỉ
                    </button>
                </div>
            </form>
        );
    }
