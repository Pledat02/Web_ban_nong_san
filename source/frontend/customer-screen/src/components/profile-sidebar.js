import React from 'react';
import { Camera, Copy } from 'lucide-react'
export function ProfileSidebar({ name, role, imageUrl, stats }) {
    return (
        <div className="p-8 border-b md:border-r md:border-b-0 border-gray-200">
            <div className="flex flex-col items-center">
                <div className="relative">
                    <img
                        src={imageUrl}
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover"
                    />
                    <button
                        className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full text-white hover:bg-blue-700 transition-colors">
                        <Camera size={20}/>
                    </button>
                </div>
                <h2 className="mt-4 text-xl font-semibold text-gray-900">{name}</h2>
                <p className="text-gray-500">{role}</p>

                <div className="w-full mt-8 space-y-4">
                    <div className="flex justify-between items-center text-gray-600">
                        <span>Applications</span>
                        <span className="text-orange-500">{stats.applications}</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-600">
                        <span>Interviews</span>
                        <span className="text-green-500">{stats.interviews}</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-600">
                        <span>Active Jobs</span>
                        <span>{stats.activeJobs}</span>
                    </div>
                </div>

                <button
                    className="mt-8 w-full py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                    View Public Profile
                </button>

                <div className="mt-4 w-full flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg">
                    <input
                        type="text"
                        value="https://profile.com/alex"
                        readOnly
                        className="flex-1 bg-transparent text-sm text-gray-500 outline-none"
                    />
                    <button className="text-gray-400 hover:text-gray-600">
                        <Copy size={16}/>
                    </button>
                </div>
            </div>
        </div>
    );
}