// src/components/Admin/AdminDashboard.jsx
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { getCookie } from '../../utils/helpers';
import ProductosView from './ProductosView';
import TarjetasView from './TarjetasView';
import styles from './AdminDashboard.module.css';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('productos');

  const verificarAutenticacion = useCallback(async () => {
    try {
      const authCheck = await fetch(
        `${import.meta.env.VITE_API_URL}/api/usuarios/autenticacion/check_auth/`,
        { method: 'GET', credentials: 'include' }
      );

      if (!authCheck.ok) {
        navigate('/admin/login');
        return;
      }

      const responseMe = await fetch(
        `${import.meta.env.VITE_API_URL}/api/usuarios/autenticacion/me/`,
        { method: 'GET', credentials: 'include' }
      );

      if (responseMe.status === 401) {
        navigate('/admin/login');
        return;
      }

      if (responseMe.ok) {
        const data = await responseMe.json();
        setAdmin(data);
      }
    } catch (err) {
      console.error('Error de autenticación:', err);
      navigate('/admin/login');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    verificarAutenticacion();
  }, [verificarAutenticacion]);

  const handleLogout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/usuarios/autenticacion/logout/`, {
        method: 'POST',
        headers: { 'X-CSRFToken': getCookie('csrftoken') },
        credentials: 'include'
      });
      toast.success('Sesión cerrada correctamente');
      navigate('/admin/login');
    } catch (err) {
      toast.error('Error al cerrar sesión');
    }
  };

  if (loading) {
    return <div className={styles.loading}>Cargando panel de administración...</div>;
  }

  return (
    <div className={styles.dashboard}>
      <Toaster position="top-right" reverseOrder={false} />
      
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logoMark} aria-hidden="true" />
          <div>
            <span className={styles.kicker}>360 Digital</span>
            <h1>Panel Administrador</h1>
          </div>
          {admin && <p className={styles.welcomeText}>Bienvenido, {admin.usuario}</p>}
        </div>
        <button type="button" onClick={handleLogout} className={styles.logoutBtn}>
          Cerrar Sesión
        </button>
      </div>

      <div className={styles.container}>
        <div className={styles.tabsContainer}>
          <button 
            className={activeTab === 'productos' ? styles.tabActive : styles.tab}
            onClick={() => setActiveTab('productos')}
          >
            Productos
          </button>
          <button 
            className={activeTab === 'tarjetas' ? styles.tabActive : styles.tab}
            onClick={() => setActiveTab('tarjetas')}
          >
            Tarjetas (Catálogo)
          </button>
        </div>

        <div className={styles.tabContent}>
          {activeTab === 'productos' ? <ProductosView /> : <TarjetasView />}
        </div>
      </div>
    </div>
  );
}