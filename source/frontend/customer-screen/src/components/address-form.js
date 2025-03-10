import React from 'react';

export function AddressForm({ data, onChange }) {
    const renderInput = (name, label) => (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">
                {label}
            </label>
            <input
                type="text"
                name={name}
                id={name}
                value={data[name]}
                onChange={onChange}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
        </div>
    );

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Address Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderInput('province', 'Province/State')}
                {renderInput('district', 'District')}
                {renderInput('ward', 'Ward')}
                {renderInput('street', 'Street Address')}
                {renderInput('postalCode', 'Postal Code')}
                {renderInput('hamlet', 'Hamlet')}
            </div>
        </div>
    );
}
