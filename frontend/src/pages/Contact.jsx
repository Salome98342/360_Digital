import { useState } from 'react';
import Header from '../components/Header/Header.jsx';
import styles from './Contact.module.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    mensaje: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Por ahora solo mostrar confirmación
    // Luego conectar con backend
    console.log('Formulario enviado:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ nombre: '', email: '', mensaje: '' });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className={styles.container}>
      <Header />

      <div className={styles.content}>
        {/* Left Column - Contact Info */}
        <div className={styles.leftColumn}>
          <h1 className={styles.title}>Contacto</h1>
          
          <div className={styles.info}>
            <h3>Información de Contacto</h3>
            
            <div className={styles.infoItem}>
              <div className={styles.icon}>✉</div>
              <div>
                <h4>Correo</h4>
                <p>info@360digital.com</p>
              </div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.icon}>📞</div>
              <div>
                <h4>Teléfono</h4>
                <p>+123-456-789</p>
              </div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.icon}>📍</div>
              <div>
                <h4>Ubicación</h4>
                <p>Calle Principal 123, Ciudad, País</p>
              </div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.icon}>⏰</div>
              <div>
                <h4>Horario</h4>
                <p>Lunes a Viernes: 9:00 AM - 6:00 PM</p>
                <p>Sábado: 10:00 AM - 2:00 PM</p>
              </div>
            </div>
          </div>

          {/* Invitation Text */}
          <div className={styles.invitation}>
            <h3>Cuéntanos tu proyecto</h3>
            <p>¿Tienes un proyecto en mente? Nos encantaría conocer tu idea y ayudarte a hacerla realidad. ¡Conéctate con nosotros hoy!</p>
          </div>
        </div>

        {/* Right Column - Form */}
        <div className={styles.rightColumn}>
          <div className={styles.formContainer}>
            <h2>Formulario de contacto</h2>
            
            {submitted && (
              <div className={styles.success}>
                ✓ Mensaje enviado exitosamente. Nos contactaremos pronto.
              </div>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="nombre">Nombre</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  placeholder="Tu nombre completo"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email">Correo electrónico</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="tu@email.com"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="mensaje">Mensaje</label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  value={formData.mensaje}
                  onChange={handleChange}
                  required
                  placeholder="Cuéntanos sobre tu proyecto..."
                  rows="5"
                />
              </div>

              <button type="submit" className={styles.submitButton}>
                Enviar
              </button>

              <p className={styles.disclaimer}>
                Se compartirá el nombre de tu perfil de Zooma. Nunca envíes contraseñas.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
