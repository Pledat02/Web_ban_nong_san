import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import addressData from "../data/address.json";
import ProfileService from "../services/profile-service";
import { useUser } from "../context/UserContext";

const AddressForm = ({ data, onChange, onSuccess }) => {
    const { user } = useUser();
    const [selectedProvince, setSelectedProvince] = useState(data.province || "");
    const [selectedDistrict, setSelectedDistrict] = useState(data.district || "");
    const [selectedWard, setSelectedWard] = useState(data.ward || "");
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    useEffect(() => {
        if (selectedProvince) {
            const province = addressData.province.find(p => p.name === selectedProvince);
            setDistricts(province ? province.district : []);
        } else {
            setDistricts([]);
        }
    }, [selectedProvince]);

    useEffect(() => {
        if (selectedDistrict) {
            const district = districts.find(d => d.name === selectedDistrict);
            setWards(district ? district.ward : []);
        } else {
            setWards([]);
        }
    }, [selectedDistrict, districts]);

    const validateForm = () => {
        if (!selectedProvince) return toast.error("Vui lòng chọn tỉnh/thành phố!");
        if (!selectedDistrict) return toast.error("Vui lòng chọn quận/huyện!");
        if (!selectedWard) return toast.error("Vui lòng chọn phường/xã!");
        if (!data.postalCode.trim()) return toast.error("Vui lòng nhập mã bưu chính!");
        if (!data.hamlet.trim()) return toast.error("Vui lòng nhập thôn/ấp!");
        return true;
    };
    // show initial address
    const handleSubmit = async () => {
        if (!validateForm()) return;
        try {
            await ProfileService.updateAddress(user.id_user, {
                province: selectedProvince,
                district: selectedDistrict,
                ward: selectedWard,
                postalCode: data.postalCode.trim(),
                hamlet: data.hamlet.trim()
            });
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error("Update failed:", error);
        }
    };
    useEffect(() => {
        if (data.province) {
            const province = addressData.province.find(p => p.name === data.province);
            if (province) {
                setSelectedProvince(data.province);
                setDistricts(province.district);
            }
        }
    }, [data.province]);

    useEffect(() => {
        if (data.district && districts.length > 0) {
            const district = districts.find(d => d.name === data.district);
            if (district) {
                setSelectedDistrict(data.district);
                setWards(district.ward);
            }
        }
    }, [data.district, districts]);

    useEffect(() => {
        if (data.ward && wards.includes(data.ward)) {
            setSelectedWard(data.ward);
        }
    }, [data.ward, wards]);

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Thông tin địa chỉ</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Tỉnh/Thành phố *</label>
                    <select
                        value={selectedProvince}
                        onChange={(e) => {
                            setSelectedProvince(e.target.value);
                            setSelectedDistrict("");
                            setSelectedWard("");
                            onChange({target: {name: "province", value: e.target.value}});
                        }}
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:ring-blue-500"
                    >
                        <option value="">Chọn tỉnh/thành phố</option>
                        {addressData.province.map((p) => (
                            <option key={p.name} value={p.name}>{p.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Quận/Huyện *</label>
                    <select
                        value={selectedDistrict}
                        onChange={(e) => {
                            setSelectedDistrict(e.target.value);
                            setSelectedWard("");
                            onChange({target: {name: "district", value: e.target.value}});
                        }}
                        disabled={!districts.length}
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:ring-blue-500"
                    >
                        <option value="">Chọn quận/huyện</option>
                        {districts.map((d) => (
                            <option key={d.name} value={d.name}>{d.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Phường/Xã *</label>
                    <select
                        value={selectedWard}
                        onChange={(e) => {
                            setSelectedWard(e.target.value);
                            onChange({target: {name: "ward", value: e.target.value}});
                        }}
                        disabled={!wards.length}
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:ring-blue-500"
                    >
                        <option value="">Chọn phường/xã</option>
                        {wards.map((w, index) => (
                            <option key={index} value={w}>{w}</option>
                        ))}
                    </select>
                </div>
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

            </div>

            <div className="flex justify-end pt-4">
                <button
                    type="button"
                    onClick={handleSubmit}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                    Cập nhật địa chỉ
                </button>
            </div>
        </div>
    );
};

export default AddressForm;
