import Header from '../components/Header/Header.jsx'
import Carousel from '../components/Carousel/Carousel.jsx'
import Services from '../components/Services/Services.jsx'
import styles from './Home.module.css'

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
    </div>
  )
}
