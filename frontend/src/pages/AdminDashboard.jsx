import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AdminDashboard.module.css';

const getCookie = (name) => {
  if (!document.cookie) return null;
  const cookies = document.cookie.split(';');
  for (const cookieStr of cookies) {
    const cookie = cookieStr.trim();
    if (cookie.startsWith(`${name}=`)) {
      return decodeURIComponent(cookie.substring(name.length + 1));
    }
  }
  return null;
};

const procesarEspecificaciones = async (productoId, especsAEliminar, especsActuales) => {
  if (especsAEliminar.length > 0) {
    for (const especId of especsAEliminar) {
      try {
        await fetch(`${import.meta.env.VITE_API_URL}/api/especificaciones/${especId}/`, {
          method: 'DELETE',
          headers: { 'X-CSRFToken': getCookie('csrftoken') },
          credentials: 'include'
        });
      } catch (err) {
        console.error('Error eliminando especificación:', err);
      }
    }
  }

  const nuevasEspecificaciones = especsActuales.filter(esp => esp.nombre && esp.valor && !esp.id);
  if (nuevasEspecificaciones.length > 0) {
    for (const esp of nuevasEspecificaciones) {
      try {
        await fetch(`${import.meta.env.VITE_API_URL}/api/especificaciones/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
          },
          credentials: 'include',
          body: JSON.stringify({
            id_producto: productoId,
            nombre: esp.nombre,
            valor: esp.valor
          })
        });
      } catch (err) {
        console.error('Error creando especificación:', err);
      }
    }
  }
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  
  // === ESTADO PARA PESTAÑAS ===
  const [activeTab, setActiveTab] = useState('productos'); // 'productos' | 'tarjetas'

  const [productos, setProductos] = useState([]);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deletedEspecificaciones, setDeletedEspecificaciones] = useState([]);

  const [formData, setFormData] = useState({
    nombre: '', descripcion: '', precio: '', categoria: 'Tarjetas', especificaciones: []
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [galeriaImages, setGaleriaImages] = useState([]);
  const [imagenACargar, setImagenACargar] = useState(null);

  const [tarjetas, setTarjetas] = useState([]);
  const [imagenTarjeta, setImagenTarjeta] = useState(null);
  const [isEditingTarjeta, setIsEditingTarjeta] = useState(false);
  const [tarjetaForm, setTarjetaForm] = useState({
    id: '', titulo: '', descripcion: '', activa: true, ruta_destino: ''
  });

  // === EFECTO PARA OCULTAR ALERTAS AUTOMÁTICAMENTE ===
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess('');
        setError('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  // === CARGA DE DATOS ===
  const verificarAutenticacion = useCallback(async () => {
    try {
      const authCheck = await fetch(`${import.meta.env.VITE_API_URL}/api/usuarios/autenticacion/check_auth/`, { method: 'GET', credentials: 'include' });
      if (!authCheck.ok) { navigate('/admin/login'); return; }

      const responseMe = await fetch(`${import.meta.env.VITE_API_URL}/api/usuarios/autenticacion/me/`, { method: 'GET', credentials: 'include' });
      if (responseMe.status === 401) { navigate('/admin/login'); return; }

      if (responseMe.ok) {
        const data = await responseMe.json();
        setAdmin(data);
      }
    } catch (err) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const cargarProductos = useCallback(async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/productos/`, { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setProductos(data.results || data);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const cargarTarjetas = useCallback(async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/servicios/`, { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setTarjetas(data.results || data);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    verificarAutenticacion();
    cargarProductos();
    cargarTarjetas();
  }, [verificarAutenticacion, cargarProductos, cargarTarjetas]);

  const handleLogout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/usuarios/autenticacion/logout/`, {
        method: 'POST', headers: { 'X-CSRFToken': getCookie('csrftoken') }, credentials: 'include'
      });
      navigate('/admin/login');
    } catch (err) { console.error(err); }
  };

  // === LÓGICA DE PRODUCTOS ===
  const resetForm = () => {
    setFormData({ nombre: '', descripcion: '', precio: '', categoria: 'Tarjetas', especificaciones: [] });
    setGaleriaImages([]);
    setImagenACargar(null);
    setEditingId(null);
    setDeletedEspecificaciones([]);
  };

  const handleEdit = (producto) => {
    setEditingId(producto.id);
    setFormData({
      nombre: producto.nombre,
      descripcion: producto.descripcion || '',
      precio: producto.precio,
      categoria: producto.categoria,
      especificaciones: producto.especificaciones || []
    });
    setGaleriaImages(producto.galeria || []);
    setDeletedEspecificaciones([]);
    setShowForm(true);
    
    // SCROLL AUTOMÁTICO AL FORMULARIO
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!globalThis.confirm('¿Estás seguro de que quieres eliminar este producto?')) return;
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/productos/${id}/`, { method: 'DELETE', credentials: 'include' });
      if (!response.ok) throw new Error('Error al eliminar');
      setSuccess('Producto eliminado exitosamente');
      cargarProductos();
    } catch (err) { setError(err.message); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `${import.meta.env.VITE_API_URL}/api/productos/${editingId}/` : `${import.meta.env.VITE_API_URL}/api/productos/`;
      const requestData = { nombre: formData.nombre, descripcion: formData.descripcion, precio: Number.parseFloat(formData.precio), categoria_nombre: formData.categoria };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'X-CSRFToken': getCookie('csrftoken') },
        credentials: 'include',
        body: JSON.stringify(requestData)
      });

      if (!response.ok) throw new Error('Error al guardar el producto');
      const productoData = await response.json();
      await procesarEspecificaciones(productoData.id, deletedEspecificaciones, formData.especificaciones);

      setSuccess(editingId ? 'Producto actualizado' : 'Producto creado');
      resetForm();
      setShowForm(false);
      cargarProductos();
    } catch (err) { setError(err.message); }
  };

  // === LÓGICA DE TARJETAS ===
  const handleEditTarjeta = (tarjeta) => {
    setIsEditingTarjeta(true);
    setTarjetaForm({
      id: tarjeta.id,
      titulo: tarjeta.nombre || '',
      descripcion: tarjeta.descripcion || '',
      activa: !!tarjeta.activo,
      ruta_destino: tarjeta.ruta_destino || ''
    });
    setImagenTarjeta(null);
    
    // SCROLL AUTOMÁTICO AL FORMULARIO
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelTarjeta = () => {
    setIsEditingTarjeta(false);
    setTarjetaForm({ id: '', titulo: '', descripcion: '', activa: true, ruta_destino: '' });
    setImagenTarjeta(null);
  };

  const handleDeleteTarjeta = async (id) => {
    if (!globalThis.confirm('¿Estás seguro de que quieres eliminar esta tarjeta?')) return;
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/servicios/${id}/`, { method: 'DELETE', headers: { 'X-CSRFToken': getCookie('csrftoken') }, credentials: 'include' });
      if (!response.ok) throw new Error('Error al eliminar');
      setSuccess('Tarjeta eliminada exitosamente');
      cargarTarjetas();
    } catch (err) { setError(err.message); }
  };

  const handleTarjetaSubmit = async (e) => {
    e.preventDefault();
    const formDataTarjeta = new FormData();
    formDataTarjeta.append('nombre', tarjetaForm.titulo);
    formDataTarjeta.append('descripcion', tarjetaForm.descripcion);
    formDataTarjeta.append('activo', tarjetaForm.activa);
    formDataTarjeta.append('ruta_destino', tarjetaForm.ruta_destino);
    if (imagenTarjeta) formDataTarjeta.append('imagen', imagenTarjeta);

    const url = isEditingTarjeta ? `${import.meta.env.VITE_API_URL}/api/servicios/${tarjetaForm.id}/` : `${import.meta.env.VITE_API_URL}/api/servicios/`;
    const method = isEditingTarjeta ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, { method, headers: { 'X-CSRFToken': getCookie('csrftoken') }, credentials: 'include', body: formDataTarjeta });
      if (!response.ok) throw new Error('Error al guardar tarjeta');

      setSuccess(isEditingTarjeta ? 'Tarjeta actualizada' : 'Tarjeta creada');
      await cargarTarjetas();
      handleCancelTarjeta();
      const fileInput = document.getElementById('tarjetaImagen');
      if (fileInput) fileInput.value = '';
    } catch (err) { setError(err.message); }
  };

  // === RENDERIZADO ===
  if (loading) return <div className={styles.loading}>Cargando...</div>;

  return (
    <div className={styles.dashboard}>
      
      {/* ALERTAS FLOTANTES */}
      {error && (
        <div style={{ position: 'fixed', top: '20px', right: '20px', backgroundColor: '#ff4d4f', color: '#fff', padding: '15px 20px', borderRadius: '8px', zIndex: 9999, boxShadow: '0 4px 12px rgba(0,0,0,0.15)', fontWeight: 'bold' }}>
          ❌ {error}
        </div>
      )}
      {success && (
        <div style={{ position: 'fixed', top: '20px', right: '20px', backgroundColor: '#52c41a', color: '#fff', padding: '15px 20px', borderRadius: '8px', zIndex: 9999, boxShadow: '0 4px 12px rgba(0,0,0,0.15)', fontWeight: 'bold' }}>
          ✅ {success}
        </div>
      )}

      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logoMark} aria-hidden="true" />
          <div>
            <span className={styles.kicker}>360 Digital</span>
            <h1>Panel administrador</h1>
          </div>
          {admin && <p>Bienvenido, {admin.usuario}</p>}
        </div>
        <button type="button" onClick={handleLogout} className={styles.logoutBtn}>Cerrar Sesión</button>
      </div>

      <div className={styles.container}>
        
        {/* NAVEGACIÓN DE PESTAÑAS */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
          <button 
            onClick={() => setActiveTab('productos')} 
            style={{ padding: '10px 20px', border: 'none', background: activeTab === 'productos' ? '#007bff' : 'transparent', color: activeTab === 'productos' ? '#fff' : '#333', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', transition: '0.3s' }}
          >
            📦 Productos
          </button>
          <button 
            onClick={() => setActiveTab('tarjetas')} 
            style={{ padding: '10px 20px', border: 'none', background: activeTab === 'tarjetas' ? '#007bff' : 'transparent', color: activeTab === 'tarjetas' ? '#fff' : '#333', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', transition: '0.3s' }}
          >
            🖼️ Tarjetas de Inicio
          </button>
        </div>

        {/* ==============================
            VISTA: PRODUCTOS
           ============================== */}
        {activeTab === 'productos' && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>Gestión de Productos</h2>
              <button
                type="button"
                className={styles.addBtn}
                onClick={() => {
                  if (editingId) resetForm();
                  else setShowForm(!showForm);
                }}
              >
                {showForm || editingId ? 'Cancelar' : '+ Nuevo Producto'}
              </button>
            </div>

            {(showForm || editingId) && (
              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label>Nombre</label>
                    <input type="text" name="nombre" value={formData.nombre} onChange={(e) => setFormData({...formData, nombre: e.target.value})} required />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Precio</label>
                    <input type="number" name="precio" value={formData.precio} onChange={(e) => setFormData({...formData, precio: e.target.value})} required step="0.01" />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Categoría</label>
                    <select name="categoria" value={formData.categoria} onChange={(e) => setFormData({...formData, categoria: e.target.value})}>
                      <option value="Tarjetas">Tarjetas</option>
                      <option value="Volantes">Volantes</option>
                      <option value="Cuadros">Cuadros</option>
                      <option value="Empaques">Empaques</option>
                      <option value="Identidad">Identidad</option>
                      <option value="Avisos Luminosos">Avisos Luminosos</option>
                      <option value="Pendones y Estructuras">Pendones y Estructuras</option>
                      <option value="Cuadros Personalizados">Cuadros Personalizados</option>
                    </select>
                  </div>
                  <div className={styles.formGroupFull}>
                    <label>Descripción</label>
                    <textarea name="descripcion" value={formData.descripcion} onChange={(e) => setFormData({...formData, descripcion: e.target.value})} rows="3" />
                  </div>
                </div>
                <button type="submit" className={styles.submitBtn}>
                  {editingId ? 'Actualizar Producto' : 'Crear Producto'}
                </button>
              </form>
            )}

            <div className={styles.productsList}>
              {productos.length === 0 ? (
                <p className={styles.empty}>No hay productos creados</p>
              ) : (
                <table className={styles.table}>
                  <thead>
                    <tr><th>ID</th><th>Nombre</th><th>Precio</th><th>Categoría</th><th>Acciones</th></tr>
                  </thead>
                  <tbody>
                    {productos.map(producto => (
                      <tr key={producto.id}>
                        <td>{producto.id}</td>
                        <td>{producto.nombre}</td>
                        <td>${Number.parseFloat(producto.precio).toLocaleString('es-CO')}</td>
                        <td>{producto.categoria}</td>
                        <td>
                          <button type="button" className={styles.editBtn} onClick={() => handleEdit(producto)}>Editar</button>
                          <button type="button" className={styles.deleteBtn} onClick={() => handleDelete(producto.id)}>Eliminar</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* ==============================
            VISTA: TARJETAS
           ============================== */}
        {activeTab === 'tarjetas' && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>Tarjetas del Catálogo</h2>
              <button type="button" className={styles.addBtn} onClick={handleCancelTarjeta} style={{ opacity: isEditingTarjeta ? 1 : 0.7 }}>
                {isEditingTarjeta ? 'Cancelar edición' : '+ Nueva Tarjeta'}
              </button>
            </div>

            <form className={styles.form} onSubmit={handleTarjetaSubmit}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>Título</label>
                  <input type="text" value={tarjetaForm.titulo} onChange={(e) => setTarjetaForm({ ...tarjetaForm, titulo: e.target.value })} required />
                </div>
                <div className={styles.formGroup}>
                  <label>Estado</label>
                  <select value={tarjetaForm.activa ? 'true' : 'false'} onChange={(e) => setTarjetaForm({ ...tarjetaForm, activa: e.target.value === 'true' })}>
                    <option value="true">Pública</option>
                    <option value="false">Oculta</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Ruta de Destino (URL)</label>
                  <input type="text" value={tarjetaForm.ruta_destino} onChange={(e) => setTarjetaForm({ ...tarjetaForm, ruta_destino: e.target.value })} required placeholder="/catalogo" />
                </div>
                <div className={styles.formGroupFull}>
                  <label>Descripción</label>
                  <textarea value={tarjetaForm.descripcion} onChange={(e) => setTarjetaForm({ ...tarjetaForm, descripcion: e.target.value })} rows="3" />
                </div>
                <div className={styles.formGroupFull}>
                  <label>Imagen</label>
                  <div className={styles.galeriaUpload}>
                    <input id="tarjetaImagen" type="file" accept="image/*" onChange={(e) => setImagenTarjeta(e.target.files[0])} className={styles.fileInput} required={!isEditingTarjeta} />
                    <button type="submit" className={styles.uploadBtn}>
                      {isEditingTarjeta ? 'Actualizar' : 'Crear'}
                    </button>
                  </div>
                </div>
              </div>
            </form>

            <div className={styles.productsList} style={{ marginTop: '1.5rem' }}>
              {tarjetas.length === 0 ? (
                <p className={styles.empty}>No hay tarjetas</p>
              ) : (
                <table className={styles.table}>
                  <thead>
                    <tr><th>ID</th><th>Imagen</th><th>Título</th><th>Estado</th><th>Acciones</th></tr>
                  </thead>
                  <tbody>
                    {tarjetas.map((tarjeta) => (
                      <tr key={tarjeta.id}>
                        <td>{tarjeta.id}</td>
                        <td><img src={tarjeta.imagen} alt={tarjeta.nombre} width="50" style={{ borderRadius: '4px' }} /></td>
                        <td>{tarjeta.nombre || tarjeta.titulo}</td>
                        <td>{tarjeta.activo ? 'Pública' : 'Oculta'}</td>
                        <td>
                          <button type="button" className={styles.editBtn} onClick={() => handleEditTarjeta(tarjeta)}>Editar</button>
                          <button type="button" className={styles.deleteBtn} onClick={() => handleDeleteTarjeta(tarjeta.id)} style={{ marginLeft: '10px' }}>Eliminar</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}