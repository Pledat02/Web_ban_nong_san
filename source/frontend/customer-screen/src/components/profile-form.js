import React from 'react';
import { AddressForm } from './address-form';

export function ProfileForm({ formData, onChange, onSubmit }) {
    const renderInput = (name, label, type = 'text') => (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">
                {label}
            </label>
            <input
                type={type}
                name={name}
                id={name}
                value={formData[name]}
                onChange={onChange}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
        </div>
    );

    const addressData = {
        province: formData.province,
        district: formData.district,
        ward: formData.ward,
        street: formData.street,
        postalCode: formData.postalCode,
        hamlet: formData.hamlet,
    };

    return (
        <form onSubmit={onSubmit} className="space-y-8">
            <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {renderInput('firstName', 'First Name')}
                    {renderInput('lastName', 'Last Name')}
                    {renderInput('phone', 'Phone Number', 'tel')}
                    {renderInput('email', 'Email Address', 'email')}
                </div>
            </div>

            <AddressForm data={addressData} onChange={onChange} />

            <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Update
                </button>
            </div>
        </form>
    );
}
