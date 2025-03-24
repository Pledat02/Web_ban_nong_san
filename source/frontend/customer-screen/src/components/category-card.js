import React from "react";

const TagCard = ({ image, title, description }) => {
    return (
        <div className="relative w-[20rem] h-[10rem] rounded-2xl overflow-hidden border-2 border-yellow-400 shadow-lg transition-transform duration-300 hover:scale-105">
            <img src={image} alt={title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center p-4 transition-all duration-300 hover:bg-opacity-30">
                <h3 className="text-white text-lg font-bold">{title}</h3>
                <p className="text-white text-sm italic">{description}</p>
            </div>
        </div>
    );
};

export default TagCard;
