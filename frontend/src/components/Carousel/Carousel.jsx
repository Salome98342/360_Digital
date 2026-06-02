import { useState, useEffect } from 'react'
import styles from './Carousel.module.css'

export default function Carousel() {
  const [currentSlide, setCurrentSlide] = useState(0)

  // Imágenes placeholder - reemplazar con tus imágenes reales
  const slides = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=500&fit=crop',
      alt: 'Proyecto 1',
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=500&fit=crop',
      alt: 'Proyecto 2',
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=500&fit=crop',
      alt: 'Proyecto 3',
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=500&fit=crop',
      alt: 'Proyecto 4',
    },
  ]

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000) // Cambiar cada 5 segundos

    return () => clearInterval(interval)
  }, [slides.length])

  const goToSlide = (index) => {
    setCurrentSlide(index)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  return (
    <div className={styles.carouselContainer}>
      {/* Slides */}
      <div className={styles.carousel}>
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`${styles.slide} ${
              index === currentSlide ? styles.active : ''
            }`}
          >
            <img src={slide.image} alt={slide.alt} />
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button className={styles.arrow + ' ' + styles.prev} onClick={prevSlide}>
        &#10094;
      </button>
      <button className={styles.arrow + ' ' + styles.next} onClick={nextSlide}>
        &#10095;
      </button>

      {/* Dots Indicator */}
      <div className={styles.dotsContainer}>
        {slides.map((_, index) => (
          <button
            key={index}
            className={`${styles.dot} ${
              index === currentSlide ? styles.activeDot : ''
            }`}
            onClick={() => goToSlide(index)}
            aria-label={`Ir a slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
