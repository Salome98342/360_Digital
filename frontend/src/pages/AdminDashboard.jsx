import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AdminDashboard.module.css';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoria: 'tarjetas',
    especificaciones: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    verificarAutenticacion();
    cargarProductos();
  }, []);

  const verificarAutenticacion = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/usuarios/autenticacion/check_auth/', {
        method: 'GET',
        credentials: 'include'
      });

      if (!response.ok) {
        navigate('/admin/login');
        return;
      }

      // Obtener datos del admin
      const meResponse = await fetch('http://localhost:8000/api/usuarios/autenticacion/me/', {
        method: 'GET',
        credentials: 'include'
      });

      if (meResponse.ok) {
        const data = await meResponse.json();
        setAdmin(data);
      }
    } catch (err) {
      console.error('Error:', err);
      navigate('/admin/login');
    }
  };

  const cargarProductos = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/productos/', {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setProductos(data.results || data);
      }
    } catch (err) {
      console.error('Error al cargar productos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:8000/api/usuarios/autenticacion/logout/', {
        method: 'POST',
        credentials: 'include'
      });
      navigate('/admin/login');
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:8000/api/productos/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          nombre: formData.nombre,
          descripcion: formData.descripcion,
          precio: formData.precio,
          categoria: formData.categoria,
          especificaciones: formData.especificaciones ? JSON.parse(formData.especificaciones) : {}
        })
      });

      if (!response.ok) {
        setError('Error al crear el producto');
        return;
      }

      setSuccess('Producto creado exitosamente');
      setFormData({
        nombre: '',
        descripcion: '',
        precio: '',
        categoria: 'tarjetas',
        especificaciones: ''
      });
      setShowForm(false);
      cargarProductos();
    } catch (err) {
      setError('Error: ' + err.message);
      console.error('Error:', err);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Cargando...</div>;
  }

  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Dashboard Admin</h1>
          {admin && <p>Bienvenido, {admin.usuario}</p>}
        </div>
        <button onClick={handleLogout} className={styles.logoutBtn}>
          Cerrar Sesión
        </button>
      </div>

      {/* Main Content */}
      <div className={styles.container}>
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Productos</h2>
            <button 
              className={styles.addBtn}
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? 'Cancelar' : '+ Nuevo Producto'}
            </button>
          </div>

          {error && <div className={styles.error}>{error}</div>}
          {success && <div className={styles.success}>{success}</div>}

          {/* Formulario */}
          {showForm && (
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>Nombre</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleFormChange}
                    required
                    placeholder="Nombre del producto"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Precio</label>
                  <input
                    type="number"
                    name="precio"
                    value={formData.precio}
                    onChange={handleFormChange}
                    required
                    placeholder="0"
                    step="0.01"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Categoría</label>
                  <select
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleFormChange}
                  >
                    <option value="tarjetas">Tarjetas</option>
                    <option value="volantes">Volantes</option>
                    <option value="banners">Banners</option>
                    <option value="otros">Otros</option>
                  </select>
                </div>

                <div className={styles.formGroupFull}>
                  <label>Descripción</label>
                  <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleFormChange}
                    placeholder="Descripción del producto"
                    rows="4"
                  ></textarea>
                </div>

                <div className={styles.formGroupFull}>
                  <label>Especificaciones (JSON)</label>
                  <textarea
                    name="especificaciones"
                    value={formData.especificaciones}
                    onChange={handleFormChange}
                    placeholder='{"tamaño": "A4", "papel": "mate"}'
                    rows="3"
                  ></textarea>
                </div>
              </div>

              <button type="submit" className={styles.submitBtn}>
                Crear Producto
              </button>
            </form>
          )}

          {/* Lista de Productos */}
          <div className={styles.productsList}>
            {productos.length === 0 ? (
              <p className={styles.empty}>No hay productos creados</p>
            ) : (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Categoría</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map(producto => (
                    <tr key={producto.id}>
                      <td>{producto.id}</td>
                      <td>{producto.nombre}</td>
                      <td>${producto.precio.toLocaleString('es-CO')}</td>
                      <td>{producto.categoria || 'N/A'}</td>
                      <td>
                        <button className={styles.editBtn}>Editar</button>
                        <button className={styles.deleteBtn}>Eliminar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
