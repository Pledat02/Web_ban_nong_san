import React from "react";

function Logo() {
    return (
        <div className="flex items-center">
            <div className="text-green-600 mr-2">
                <i className="fas fa-seedling text-3xl"></i>
            </div>
            <div className="text-2xl font-bold">
                <span className="text-red-500">AGRI</span>
                <span className="text-green-600">FRESH</span>
            </div>
        </div>
    );
}

export default Logo;
