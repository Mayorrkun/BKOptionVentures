import { useState, useEffect } from "react";
import "../css/carousel.css";
import slide1 from "../Images/Carousel/event1.jpeg";
import slide2 from "../Images/Carousel/event2.jpeg";
import slide3 from "../Images/Carousel/event3.jpeg";
import slide4 from "../Images/Carousel/tent1.jpeg";
import slide5 from "../Images/Carousel/tent2.jpeg";

const slides = [slide1, slide2, slide3, slide5];

export default function Carousel() {
    const [slideIndex, setSlideIndex] = useState(0);

    // Auto-advance slides
    useEffect(() => {
        const timer = setTimeout(() => {
            setSlideIndex((prev) => (prev + 1) % slides.length);
        }, 5000);

        return () => clearTimeout(timer); // Cleanup on unmount or re-render
    }, [slideIndex]);

    return (
        <div className="carousel">
            {slides.map((slide, i) => (
                <div
                    key={i}
                    className="slide"
                    style={{
                        backgroundImage: `url(${slide})`,
                        display: i === slideIndex ? "block" : "none",
                    }}
                />
            ))}
        </div>
    );
}