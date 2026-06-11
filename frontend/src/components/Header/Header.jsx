import { Link, useLocation } from 'react-router-dom'
import styles from './Header.module.css'
import logoImg from '../../images/Logo.png'

export default function Header() {
  const location = useLocation()


  const navLinks = [
    { label: 'Inicio', path: '/' },
    { label: 'Catalogo', path: '/catalogo' },
    { label: 'Nosotros', path: '/nosotros' },
    { label: 'Contacto', path: '/contacto' }
  ]

  const isActive = (path) => {
    if (path.startsWith('#')) return false
    return location.pathname === path
  }

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo */}
        <div className={styles.logo}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <img className={styles.logoImg} src={logoImg} alt="Logo" />
          </Link>
        </div>


        {/* Navigation */}
        <nav className={styles.nav}>
          <ul className={styles.navList}>
            {navLinks.map((link) => (
              <li key={link.label}>
                {link.path.startsWith('#') ? (
                  <a
                    href={link.path}
                    className={styles.navLink}
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    to={link.path}
                    className={`${styles.navLink} ${
                      isActive(link.path) ? styles.active : ''
                    }`}
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* CTA Button */}
        <button className={styles.ctaButton}>Cotizar</button>
      </div>
    </header>
  )
}
