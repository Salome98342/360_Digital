import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AdminLogin.module.css';
import LogoImg from '../images/Logo.png';

export default function AdminLogin() {

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    usuario: '',
    contrasena: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}api/administrador/autenticacion/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          usuario: formData.usuario,
          contrasena: formData.contrasena
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.contrasena?.[0] || data.detail || 'Error en el login');
        setLoading(false);
        return;
      }

      // Login exitoso
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 500);
    } catch (err) {
      setError('Error de conexión con el servidor');
      console.error('Error:', err);
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <h1>LOGIN ADMIN</h1>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Usuario</label>
            <input
              type="text"
              name="usuario"
              placeholder="Tu usuario"
              value={formData.usuario}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Contraseña</label>
            <input
              type="password"
              name="contrasena"
              placeholder="Tu contraseña"
              value={formData.contrasena}
              onChange={handleChange}
              required
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button
            type="submit"
            className={styles.loginButton}
            disabled={loading}
          >
            {loading ? 'INGRESANDO...' : 'INGRESE'}
          </button>
        </form>
      </div>

      <div className={styles.brandBox}>
        <h2>MARKETING Y DESARROLLO DIGITAL</h2>
        <img className={styles.logo} src={LogoImg} alt="Logo" />
        <h3>¡HAZ QUE TU <span>MARCA VENDA</span> TODOS LOS <span>DÍAS</span>!</h3>
      </div>
    </div>
  );
}
