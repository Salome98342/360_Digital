import { Link } from 'react-router-dom';
import Header from '../components/Header/Header.jsx';
import styles from './About.module.css';

export default function About() {
  return (
    <div className={styles.container}>
      <Header />

      <div className={styles.content}>
        <div className={styles.messageContainer}>
          <h1 className={styles.title}>Nosotros</h1>
            <div className={styles.comingSoon}>

            <h2>Próximamente</h2>
            <p>Estamos preparando algo increíble para ti. Nuestra historia, nuestro equipo y nuestra pasión por el diseño digital estarán aquí muy pronto.</p>
            <Link to="/" className={styles.button}>Volver al Inicio</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
