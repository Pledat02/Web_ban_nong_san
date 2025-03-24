import React, { useState } from "react";
import slider_1 from "../images/carousel/slider_1.webp"
import slider_2 from "../images/carousel/slider_2.webp"
import slider_3 from "../images/carousel/slider_3.webp"
const slides = [
    slider_1,
    slider_2,
    slider_3,
];

const Carousel = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    };

    return (
        <div className="relative w-full overflow-hidden">
            <div className="flex transition-transform duration-500 ease-in-out"
                 style={{
                     transform: `translateX(-${currentSlide * 100}%)`,
                 }}>
                {slides.map((src, index) => (
                    <div key={index} className="w-full flex-shrink-0 min-w-full">
                        <img src={src} className="w-full h-[30rem] object-cover rounded-lg" alt={`Slide ${index}`}/>
                    </div>
                ))}
            </div>
            <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                <button onClick={prevSlide} className="btn btn-circle">❮</button>
                <button onClick={nextSlide} className="btn btn-circle">❯</button>
            </div>
        </div>

    );
};

export default Carousel;
