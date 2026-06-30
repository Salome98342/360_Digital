import { useState } from 'react';
import Header from '../components/Header/Header.jsx';
import styles from './Contact.module.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    mensaje: '',
    contactar_por_whatsapp: false,
    contactar_por_correo: true
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(false);
    
    try {
      const response = await fetch('http://localhost:8000/api/contacto/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre_completo: formData.nombre,
          correo: formData.email,
          telefono: formData.telefono,
          mensaje: formData.mensaje,
          contactar_por_whatsapp: formData.contactar_por_whatsapp,
          contactar_por_correo: formData.contactar_por_correo
        })
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({ nombre: '', email: '', telefono: '', mensaje: '', contactar_por_whatsapp: false, contactar_por_correo: true });
        setTimeout(() => {
          setSubmitted(false);
        }, 5000);
      } else {
        setError(true);
      }
    } catch (error) {
      console.error('Error al enviar formulario:', error);
      setError(true);
    } finally {
      setIsSubmitting(false);
    }
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
                <p>publicidad360caicedonia@gmail.com</p>
              </div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.icon}>📞</div>
              <div>
                <h4>Teléfono</h4>
                <p>+57 318 775 2351</p>
              </div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.icon}>📍</div>
              <div>
                <h4>Ubicación</h4>
                <p>Cra 12 # 12-08 Piso 2 Caicedonia, Valle</p>
              </div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.icon}>⏰</div>
              <div>
                <h4>Horario</h4>
                <p>Lunes a Viernes: 9:00 AM - 6:00 PM</p>
                <p>Sábado: 9:00 AM - 2:00 PM</p>
              </div>
            </div>
          </div>

          {/* Invitation Text */}
          <div className={styles.invitation}>
            <h3>Cuéntanos tu proyecto</h3>
            <p>¿Tienes un proyecto en mente? <br> </br>Nos encantaría conocer tu idea y ayudarte a hacerla realidad. ¡Conéctate con nosotros hoy!</p>
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

            {error && (
              <div className={styles.error}>
                ✗ Error al enviar el mensaje. Por favor, intenta de nuevo.
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="telefono">Teléfono</label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="+57 123 456 7890"
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
                />
              </div>

              <div className={styles.checkboxGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="contactar_por_whatsapp"
                    checked={formData.contactar_por_whatsapp}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                  <span>Prefiero que me contacten por WhatsApp</span>
                </label>
              </div>

              <div className={styles.checkboxGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="contactar_por_correo"
                    checked={formData.contactar_por_correo}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                  <span>Prefiero que me contacten por correo electrónico</span>
                </label>
              </div>

              <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
                {isSubmitting ? 'Enviando...' : 'Enviar'}
              </button>

              <p className={styles.disclaimer}>
                Se compartiran datos como tu nomrbre y correo electrónico con el equipo de 360 Digital para responder a tu consulta. No compartiremos tu información con terceros sin tu consentimiento.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
