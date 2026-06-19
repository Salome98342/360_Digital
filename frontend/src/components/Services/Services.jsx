import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './Services.module.css';

export default function Services() {
  const [tarjetas, setTarjetas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar las tarjetas (servicios) desde la API real
  useEffect(() => {
    const fetchTarjetas = async () => {
      try {
        setLoading(true);
        // Llamamos al endpoint de servicios que ya tienes en Django
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/servicios/`);
        if (response.ok) {
          const data = await response.json();
          // Filtramos para que solo se muestren las activas
          const tarjetasActivas = (data.results || data).filter(t => t.activo);
          setTarjetas(tarjetasActivas);
        }
      } catch (error) {
        console.error('Error al cargar las tarjetas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTarjetas();
  }, []);

  if (loading) {
    return <div className={styles.loading}>Cargando catálogo...</div>;
  }

  return (
    <section className={styles.servicesSection}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            Explora nuestro <span className={styles.highlight}>Catálogo</span>
          </h2>
          <p className={styles.sectionDescription}>
            Selecciona una categoría para ver todos los productos y opciones disponibles.
          </p>
        </div>

        <div className={styles.servicesGrid}>
          {tarjetas.length === 0 ? (
            <p style={{ color: '#fff', textAlign: 'center' }}>No hay categorías disponibles en este momento.</p>
          ) : (
            tarjetas.map((tarjeta) => (
              // AHORA USA LA RUTA DE LA BASE DE DATOS (Con un fallback al catálogo por si acaso)
              <Link 
                key={tarjeta.id} 
                to={tarjeta.ruta_destino || '/catalogo'} 
                style={{ textDecoration: 'none' }}
              >
                <div className={styles.serviceCard}>
                  {/* Se renderiza la imagen real proveniente de Supabase/Django */}
                  <img src={tarjeta.imagen} alt={tarjeta.nombre} className={styles.serviceImage} />
                  <div className={styles.serviceOverlay}>
                    <h3 className={styles.serviceTitle}>{tarjeta.nombre}</h3>
                    <p className={styles.serviceDescription}>{tarjeta.descripcion}</p>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
}