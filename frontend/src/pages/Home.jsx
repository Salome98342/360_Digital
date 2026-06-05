import Header from '../components/Header/Header.jsx'
import Carousel from '../components/Carousel/Carousel.jsx'
import Services from '../components/Services/Services.jsx'
import styles from './Home.module.css'

// Datos de ejemplo para las reseñas
const reviewsData = [
  { id: 1, name: "Carlos M.", text: "¡Excelente servicio! Llevaron el branding de mi empresa a otro nivel.", rating: 5 },
  { id: 2, name: "Laura G.", text: "Muy profesionales. La página web quedó exactamente como la imaginaba.", rating: 5 },
  { id: 3, name: "Andrés F.", text: "Aumentamos nuestras ventas desde que manejan nuestras redes sociales.", rating: 4 },
  { id: 4, name: "Sofía T.", text: "El equipo es muy atento y creativo. Recomendados al 100%.", rating: 5 },
]

export default function Home() {
  return (
    <div className={styles.home}>
      <Header />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          {/* Left Content */}
          <div className={styles.heroContent}>
            <h3 className={styles.tagline}>
              MARKETING Y DESARROLLO DIGITAL
            </h3>
            <h1 className={styles.mainTitle}>
              ¡HAZ QUE TU{' '}
              <span className={styles.highlight}>MARCA VENDA</span>
              {' '}TODOS LOS <span className={styles.highlight}>DÍAS</span>!
            </h1>
            <p className={styles.description}>
              Acompañamiento integral en gestión de redes sociales, branding,
              posicionamiento de marca, desarrollo web y comunicación
              organizacional.
            </p>
          </div>

          {/* Right Content - Carousel */}
          <div className={styles.carouselSection}>
            <Carousel />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <Services />

      {/* Location & Reviews Section */}
      <section className={styles.locationReviews}>
        <div className={styles.locationContainer}>
          
          {/* Map Container */}
          <div className={styles.mapSection}>
            <h2 className={styles.sectionTitle}>ENCUÉNTRANOS <span className={styles.highlight}>AQUÍ</span></h2>
            <div className={styles.iframeWrapper}>
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3978.4036888188243!2d-75.8269065!3d4.335065!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e38539941b7e95d%3A0x5e2854dfb0737227!2s360%20Digital!5e0!3m2!1ses-419!2sco!4v1780687194905!5m2!1ses-419!2sco" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade">
              </iframe>
            </div>
          </div>

          {/* Reviews Container */}
          <div className={styles.reviewsSection}>
            <h2 className={styles.sectionTitle}>NUESTROS <span className={styles.highlight}>CLIENTES</span></h2>
            <div className={styles.reviewsCarousel}>
              {reviewsData.map((review) => (
                <div key={review.id} className={styles.reviewCard}>
                  <div className={styles.stars}>
                    {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                  </div>
                  <p className={styles.reviewText}>"{review.text}"</p>
                  <h4 className={styles.reviewAuthor}>- {review.name}</h4>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>
    </div>
  )
}