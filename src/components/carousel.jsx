import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import '../css/carousel.css';
import slide1 from '../Images/Carousel/event1.jpeg';
import slide2 from '../Images/Carousel/event2.jpeg';
import slide3 from '../Images/Carousel/event3.jpeg';
import slide4 from '../Images/Carousel/tent1.jpeg';
import slide5 from '../Images/Carousel/tent2.jpeg';

const slides = [
  { img: slide1, text: 'Your Event, Our Priority', subtext: 'Premium canopies, chairs, tables and more for any occasion', cta: 'Browse Rentals', href: '/rentals' },
  { img: slide2, text: 'Elegant Event Setups', subtext: 'From intimate gatherings to large corporate events — we have you covered', cta: 'View Packages', href: '/rentals' },
  { img: slide3, text: 'Quality You Can Count On', subtext: 'Well-maintained equipment delivered and set up by our team', cta: 'Learn More', href: '/about' },
  { img: slide5, text: 'Canopies for Every Occasion', subtext: 'Small or large, indoor or outdoor — our tents fit every event', cta: 'Shop Sales', href: '/sales' },
];

export default function Carousel() {
  const [index, setIndex] = useState(0);

  const next = useCallback(() => setIndex(i => (i + 1) % slides.length), []);
  const prev = () => setIndex(i => (i - 1 + slides.length) % slides.length);

  useEffect(() => {
    const timer = setTimeout(next, 5000);
    return () => clearTimeout(timer);
  }, [index, next]);

  return (
    <div className="carousel">
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`slide${i === index ? ' active' : ''}`}
          style={{ backgroundImage: `url(${slide.img})` }}
        >
          <div className="slide-overlay">
            <h1 className="slide-text">{slide.text}</h1>
            <p className="slide-subtext">{slide.subtext}</p>
            <Link to={slide.href} className="btn btn-primary btn-lg slide-cta">{slide.cta}</Link>
          </div>
        </div>
      ))}

      <button className="carousel-arrow left" onClick={prev} aria-label="Previous slide">&#8249;</button>
      <button className="carousel-arrow right" onClick={next} aria-label="Next slide">&#8250;</button>

      <div className="carousel-dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`dot${i === index ? ' active' : ''}`}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
