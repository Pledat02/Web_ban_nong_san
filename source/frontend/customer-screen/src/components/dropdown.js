import React from "react";

const DropdownItem = ({ icon: Icon, title, onClick }) => {
    return (
        <li
            className="flex text-black items-center gap-2 p-2 hover:bg-gray-100 rounded-md cursor-pointer"
            onClick={onClick}
        >
            {Icon && <Icon size={18} />}
            <span>{title}</span>
        </li>
    );
};

export default DropdownItem;
