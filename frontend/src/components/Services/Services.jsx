import { useState } from 'react'
import styles from './Services.module.css'

export default function Services() {
  const [selectedService, setSelectedService] = useState(null)

  // Array de servicios
  const services = [
    {
      id: 1,
      title: 'Gestión de Redes Sociales',
      // Aquí irá la descripción del servicio
      description: 'Texto - Descripción del servicio de gestión de redes sociales',
      // Aquí irá la imagen del servicio
      image: 'https://images.unsplash.com/photo-1611532736579-6b16e2b50449?w=400&h=300&fit=crop',
    },
    {
      id: 2,
      title: 'Branding',
      // Aquí irá la descripción del servicio
      description: 'Texto - Descripción del servicio de branding',
      // Aquí irá la imagen del servicio
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop',
    },
    {
      id: 3,
      title: 'Posicionamiento de Marca',
      // Aquí irá la descripción del servicio
      description: 'Texto - Descripción del servicio de posicionamiento de marca',
      // Aquí irá la imagen del servicio
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
    },
    {
      id: 4,
      title: 'Páginas Web',
      // Aquí irá la descripción del servicio
      description: 'Texto - Descripción del servicio de desarrollo web',
      // Aquí irá la imagen del servicio
      image: 'https://images.unsplash.com/photo-1460925895917-adf4e565f900?w=400&h=300&fit=crop',
    },
    {
      id: 5,
      title: 'Comunicación Organizacional',
      // Aquí irá la descripción del servicio
      description: 'Texto - Descripción del servicio de comunicación organizacional',
      // Aquí irá la imagen del servicio
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
    },
    {
      id: 6,
      title: 'Producción Audiovisual',
      // Aquí irá la descripción del servicio
      description: 'Texto - Descripción del servicio de producción audiovisual',
      // Aquí irá la imagen del servicio
      image: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=400&h=300&fit=crop',
    },
  ]

  return (
    <section className={styles.servicesSection}>
      <div className={styles.container}>
        {/* Título de la sección */}
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            {/* Aquí irá el título principal de la sección */}
            Siempre lo hemos dicho: <span className={styles.highlight}>Nuestro negocio;</span> hacer crecer el suyo.
          </h2>
          <p className={styles.sectionDescription}>
            {/* Aquí irá la descripción de la sección */}
            Conoce una agencia integral que combina el poder de la creatividad con la efectividad de la estrategia.
          </p>
        </div>

        {/* Grid de servicios */}
        <div className={styles.servicesGrid}>
          {services.map((service) => (
            <div
              key={service.id}
              className={styles.serviceCard}
              onClick={() => setSelectedService(selectedService === service.id ? null : service.id)}
            >
              {/* Imagen del servicio */}
              <img src={service.image} alt={service.title} className={styles.serviceImage} />

              {/* Overlay con información */}
              <div className={`${styles.serviceOverlay} ${selectedService === service.id ? styles.active : ''}`}>
                <h3 className={styles.serviceTitle}>{service.title}</h3>
                <p className={styles.serviceDescription}>{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
