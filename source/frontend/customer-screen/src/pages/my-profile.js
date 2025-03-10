import React, { useState } from 'react';
import { ProfileSidebar } from '../components/profile-sidebar';
import { ProfileForm } from '../components/profile-form';
import {useUser} from "../context/UserContext";


function App() {
    const [formData, setFormData] = useState({
        firstName: 'Alex',
        lastName: 'Johnson',
        phone: '(555) 123-4567',
        email: 'alex@example.com',
        province: 'San Francisco',
        district: 'United States',
        ward: 'San Francisco',
        street: '123 Main St',
        postalCode: '94105',
        hamlet: '',
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    const{user} =useUser();
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <div className="bg-white rounded-2xl shadow">
                    <div className="grid grid-cols-1 md:grid-cols-4">
                        <ProfileSidebar
                            user={user}
                        />

                        <div className="col-span-3 p-8">
                            <ProfileForm
                                formData={formData}
                                onChange={handleChange}
                                onSubmit={handleSubmit}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
