import { useState, useEffect } from 'react'
import styles from './Services.module.css'

export default function Services() {
  const [selectedService, setSelectedService] = useState(null)
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  // Cargar servicios desde la API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true)
        const response = await fetch('http://localhost:8000/api/servicios/')
        const data = await response.json()
        setServices(data.results || data)
      } catch (error) {
        console.error('Error al cargar servicios:', error)
        // Fallback a servicios locales
        setServices([
          {
            id: 1,
            nombre: 'Gestión de Redes Sociales',
            descripcion: 'Administración estratégica y creación de contenido para tus redes sociales',
            imagen: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=300&fit=crop',
          },
          {
            id: 2,
            nombre: 'Branding',
            descripcion: 'Desarrollo completo de identidad visual y marca corporativa',
            imagen: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop',
          },
          {
            id: 3,
            nombre: 'Posicionamiento de Marca',
            descripcion: 'Estrategias de posicionamiento en buscadores y mercado',
            imagen: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
          },
          {
            id: 4,
            nombre: 'Páginas Web',
            descripcion: 'Diseño y desarrollo de sitios web responsive y modernos',
            imagen: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop',
          },
          {
            id: 5,
            nombre: 'Comunicación Organizacional',
            descripcion: 'Estrategias de comunicación interna y externa',
            imagen: 'https://images.unsplash.com/photo-1460925895917-adf4e565f900?w=400&h=300&fit=crop',
          },
          {
            id: 6,
            nombre: 'Producción Audiovisual',
            descripcion: 'Videos profesionales, edición y contenido multimedia',
            imagen: 'https://images.unsplash.com/photo-1611532736579-6b16e2b50449?w=400&h=300&fit=crop',
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  return (
    <section className={styles.servicesSection}>
      <div className={styles.container}>
        {/* Título de la sección */}
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            Siempre lo hemos dicho: <span className={styles.highlight}>Nuestro negocio;</span> hacer crecer el suyo.
          </h2>
          <p className={styles.sectionDescription}>
            Conoce una agencia integral que combina el poder de la creatividad con la efectividad de la estrategia.
          </p>
        </div>

        {/* Grid de servicios */}
        <div className={styles.servicesGrid}>
          {loading ? (
            <p>Cargando servicios...</p>
          ) : (
            services.map((service) => (
              <div
                key={service.id}
                className={styles.serviceCard}
                onClick={() => setSelectedService(selectedService === service.id ? null : service.id)}
              >
                {/* Imagen del servicio */}
                <img src={service.imagen} alt={service.nombre} className={styles.serviceImage} />

                {/* Overlay con información */}
                <div className={`${styles.serviceOverlay} ${selectedService === service.id ? styles.active : ''}`}>
                  <h3 className={styles.serviceTitle}>{service.nombre}</h3>
                  <p className={styles.serviceDescription}>{service.descripcion}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
