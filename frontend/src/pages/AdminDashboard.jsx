import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AdminDashboard.module.css';

// 1. Refactorizado a for-of (S4138)
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

// 3. Reducción de Complejidad Cognitiva (S3776): Extraemos la lógica de especificaciones
const procesarEspecificaciones = async (productoId, especsAEliminar, especsActuales) => {
  // Eliminar las que se quitaron
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

  // Guardar las nuevas
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
  const [productos, setProductos] = useState([]);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deletedEspecificaciones, setDeletedEspecificaciones] = useState([]);

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoria: 'Tarjetas',
    especificaciones: []
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [galeriaImages, setGaleriaImages] = useState([]);
  const [imagenACargar, setImagenACargar] = useState(null);

  // ==============================
  // TARJETAS / SERVICIOS (Admin)
  // ==============================
  const [tarjetas, setTarjetas] = useState([]);
  const [imagenTarjeta, setImagenTarjeta] = useState(null);
  const [isEditingTarjeta, setIsEditingTarjeta] = useState(false);
  const [tarjetaForm, setTarjetaForm] = useState({
    id: '',
    titulo: '', 
    descripcion: '',
    activa: true, 
    ruta_destino: ''
  });

  const cargarTarjetas = useCallback(async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/servicios/`, {
        credentials: 'include'
      });

      if (!response.ok) return;
      const data = await response.json();
      setTarjetas(data.results || data);
    } catch (err) {
      console.error('Error al cargar tarjetas:', err);
    }
  }, []);

  const handleTarjetaSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const formDataTarjeta = new FormData();
    // AQUI SE CAMBIA PARA QUE HAGA MATCH CON EL MODELO EN DJANGO ('nombre' y 'activo')
    formDataTarjeta.append('nombre', tarjetaForm.titulo);
    formDataTarjeta.append('descripcion', tarjetaForm.descripcion);
    formDataTarjeta.append('activo', tarjetaForm.activa);
    formDataTarjeta.append('ruta_destino', tarjetaForm.ruta_destino);

    if (imagenTarjeta) {
      formDataTarjeta.append('imagen', imagenTarjeta);
    }

    const url = isEditingTarjeta
      ? `${import.meta.env.VITE_API_URL}/api/servicios/${tarjetaForm.id}/`
      : `${import.meta.env.VITE_API_URL}/api/servicios/`;

    const method = isEditingTarjeta ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'X-CSRFToken': getCookie('csrftoken')
        },
        credentials: 'include',
        body: formDataTarjeta
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        setError(`Error al guardar: ${JSON.stringify(errorData)}`);
        return;
      }

      setSuccess(isEditingTarjeta ? 'Tarjeta actualizada!' : 'Tarjeta creada!');
      await cargarTarjetas();

      setTarjetaForm({ id: '', titulo: '', descripcion: '', activa: true, ruta_destino: '' });
      setImagenTarjeta(null);
      setIsEditingTarjeta(false);
      
      const fileInput = document.getElementById('tarjetaImagen');
      if (fileInput) fileInput.value = '';
    } catch (err) {
      setError('Error: ' + err.message);
      console.error('Error guardando tarjeta:', err);
    }
  };

  const handleEditTarjeta = (tarjeta) => {
    setIsEditingTarjeta(true);
    setTarjetaForm({
      id: tarjeta.id,
      titulo: tarjeta.nombre || '', // Backend devuelve 'nombre'
      descripcion: tarjeta.descripcion || '',
      activa: !!tarjeta.activo, // Backend devuelve 'activo'
      ruta_destino: tarjeta.ruta_destino || ''
    });
    setImagenTarjeta(null);
  };

  const handleCancelTarjeta = () => {
    setIsEditingTarjeta(false);
    setTarjetaForm({ id: '', titulo: '', descripcion: '', activa: true, ruta_destino: '' });
    setImagenTarjeta(null);
    setError('');
    setSuccess('');
  };

  const handleDeleteTarjeta = async (id) => {
    if (!globalThis.confirm('¿Estás seguro de que quieres eliminar esta tarjeta?')) {
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/servicios/${id}/`, {
        method: 'DELETE',
        headers: { 'X-CSRFToken': getCookie('csrftoken') },
        credentials: 'include'
      });

      if (!response.ok) {
        setError('Error al eliminar la tarjeta');
        return;
      }

      setSuccess('Tarjeta eliminada exitosamente');
      cargarTarjetas(); 
    } catch (err) {
      setError('Error: ' + err.message);
      console.error('Error al eliminar tarjeta:', err);
    }
  };

  // ==============================

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
    }
  }, [navigate]);

  const cargarProductos = useCallback(async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/productos/`, {
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
  }, []);

  useEffect(() => {
    verificarAutenticacion();
    cargarProductos();
    cargarTarjetas();
  }, [verificarAutenticacion, cargarProductos, cargarTarjetas]);

  const handleLogout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/usuarios/autenticacion/logout/`, {
        method: 'POST',
        headers: { 'X-CSRFToken': getCookie('csrftoken') },
        credentials: 'include'
      });
      navigate('/admin/login');
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEspecificacionChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      especificaciones: prev.especificaciones.map((esp, i) =>
        i === index ? { ...esp, [field]: value } : esp
      )
    }));
  };

  const addEspecificacion = () => {
    setFormData(prev => ({
      ...prev,
      especificaciones: [...prev.especificaciones, { nombre: '', valor: '' }]
    }));
  };

  const removeEspecificacion = (index) => {
    const especificacion = formData.especificaciones[index];
    if (especificacion.id) {
      setDeletedEspecificaciones(prev => [...prev, especificacion.id]);
    }
    setFormData(prev => ({
      ...prev,
      especificaciones: prev.especificaciones.filter((_, i) => i !== index)
    }));
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      precio: '',
      categoria: 'Tarjetas',
      especificaciones: []
    });
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
    setError('');
    setSuccess('');
  };

  const handleDelete = async (id) => {
    if (!globalThis.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/productos/${id}/`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        setError('Error al eliminar el producto');
        return;
      }

      setSuccess('Producto eliminado exitosamente');
      cargarProductos();
    } catch (err) {
      setError('Error: ' + err.message);
      console.error('Error al eliminar:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId
        ? `${import.meta.env.VITE_API_URL}/api/productos/${editingId}/`
        : `${import.meta.env.VITE_API_URL}/api/productos/`;

      const requestData = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        precio: Number.parseFloat(formData.precio),
        categoria_nombre: formData.categoria
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken')
        },
        credentials: 'include',
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(`Error: ${JSON.stringify(errorData)}`);
        return;
      }

      const productoData = await response.json();
      await procesarEspecificaciones(productoData.id, deletedEspecificaciones, formData.especificaciones);

      setSuccess(editingId ? 'Producto actualizado exitosamente' : 'Producto creado exitosamente');
      resetForm();
      setShowForm(false);
      cargarProductos();
    } catch (err) {
      setError('Error: ' + err.message);
      console.error('Error en submit:', err);
    }
  };

  const handleUploadImage = async () => {
    if (!imagenACargar || !editingId) {
      setError('Selecciona una imagen primero');
      return;
    }

    try {
      const formDataImg = new FormData();
      formDataImg.append('imagen', imagenACargar);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/productos/${editingId}/upload_image/`, {
        method: 'POST',
        headers: { 'X-CSRFToken': getCookie('csrftoken') },
        credentials: 'include',
        body: formDataImg
      });

      const responseData = await response.json();

      if (!response.ok) {
        setError(`Error al subir imagen: ${JSON.stringify(responseData)}`);
        return;
      }

      const nuevaImagen = responseData;
      setGaleriaImages([...galeriaImages, nuevaImagen]);
      setImagenACargar(null);
      setSuccess('Imagen subida exitosamente');

      const fileInput = document.getElementById('imagenUploadInput');
      if (fileInput) fileInput.value = '';
    } catch (err) {
      console.error('Error al subir imagen:', err);
      setError('Error al subir imagen: ' + err.message);
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (!globalThis.confirm('¿Estás seguro de que quieres eliminar esta imagen?')) {
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/productos/${editingId}/delete_image/?image_id=${imageId}`,
        {
          method: 'DELETE',
          headers: { 'X-CSRFToken': getCookie('csrftoken') },
          credentials: 'include'
        }
      );

      if (!response.ok) {
        setError('Error al eliminar la imagen');
        return;
      }

      setGaleriaImages(galeriaImages.filter(img => img.id !== imageId));
      setSuccess('Imagen eliminada exitosamente');
    } catch (err) {
      setError('Error al eliminar imagen: ' + err.message);
      console.error('Error:', err);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Cargando...</div>;
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logoMark} aria-hidden="true" />
          <div>
            <span className={styles.kicker}>360 Digital</span>
            <h1>Panel administrador</h1>
          </div>
          {admin && <p>Bienvenido, {admin.usuario}</p>}
        </div>
        <button type="button" onClick={handleLogout} className={styles.logoutBtn}>
          Cerrar Sesión
        </button>
      </div>

      <div className={styles.container}>
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Productos</h2>
            <button
              type="button"
              className={styles.addBtn}
              onClick={() => {
                if (editingId) {
                  resetForm();
                } else {
                  setShowForm(!showForm);
                }
              }}
            >
              {showForm || editingId ? 'Cancelar' : '+ Nuevo Producto'}
            </button>
          </div>

          {error && <div className={styles.error}>{error}</div>}
          {success && <div className={styles.success}>{success}</div>}

          {(showForm || editingId) && (
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.formGrid}>
                {/* Campos del Producto... */}
                <div className={styles.formGroup}>
                  <label htmlFor="nombreProducto">Nombre</label>
                  <input
                    id="nombreProducto"
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleFormChange}
                    required
                    placeholder="Nombre del producto"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="precioProducto">Precio</label>
                  <input
                    id="precioProducto"
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
                  <label htmlFor="categoriaProducto">Categoría</label>
                  <select
                    id="categoriaProducto"
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleFormChange}
                  >
                    <option value="Tarjetas">Tarjetas</option>
                    <option value="Volantes">Volantes</option>
                    <option value="Cuadros">Cuadros</option>
                    <option value="Empaques">Empaques</option>
                    <option value="Identidad">Identidad</option>
                    <option value="Logos">Logos</option>
                    <option value="Pendones">Pendones</option>
                    <option value="Posters">Posters</option>
                    <option value="Avisos Luminosos">Avisos Luminosos</option>
                    <option value="Pendones y Estructuras">Pendones y Estructuras</option>
                  </select>
                </div>

                <div className={styles.formGroupFull}>
                  <label htmlFor="descripcionProducto">Descripción</label>
                  <textarea
                    id="descripcionProducto"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleFormChange}
                    placeholder="Descripción del producto"
                    rows="3"
                  />
                </div>

                <div className={styles.formGroupFull}>
                  <label htmlFor="btnAgregarEspec">Especificaciones</label>
                  <div className={styles.especificaciones}>
                    {formData.especificaciones.map((esp, index) => (
                      <div key={esp.id || `espec-${index}`} className={styles.especRow}>
                        <input
                          type="text"
                          aria-label={`Nombre de la especificación ${index + 1}`}
                          placeholder="Ej: Tamaño"
                          value={esp.nombre}
                          onChange={(e) => handleEspecificacionChange(index, 'nombre', e.target.value)}
                          className={styles.especNombre}
                        />
                        <input
                          type="text"
                          aria-label={`Valor de la especificación ${index + 1}`}
                          placeholder="Ej: A4"
                          value={esp.valor}
                          onChange={(e) => handleEspecificacionChange(index, 'valor', e.target.value)}
                          className={styles.especValor}
                        />
                        <button
                          type="button"
                          aria-label={`Eliminar especificación ${index + 1}`}
                          onClick={() => removeEspecificacion(index)}
                          className={styles.removeBtn}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    id="btnAgregarEspec"
                    type="button"
                    onClick={addEspecificacion}
                    className={styles.addEspecBtn}
                  >
                    + Agregar especificación
                  </button>
                </div>

                {editingId && (
                  <div className={styles.formGroupFull}>
                    <label htmlFor="imagenUploadInput">Galería de Imágenes</label>
                    <div className={styles.galeriaUpload}>
                      <input
                        id="imagenUploadInput"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImagenACargar(e.target.files[0])}
                        className={styles.fileInput}
                      />
                      <button
                        type="button"
                        onClick={handleUploadImage}
                        className={styles.uploadBtn}
                        disabled={!imagenACargar}
                      >
                        Subir imagen
                      </button>
                    </div>

                    {galeriaImages.length > 0 && (
                      <div className={styles.galeriaGrid}>
                        {galeriaImages.map((img) => (
                          <div key={img.id} className={styles.galeriaItem}>
                            <img
                              src={img.url_imagen}
                              alt={img.descripcion || 'Imagen del producto'}
                              className={styles.galeriaImage}
                            />
                            <button
                              type="button"
                              onClick={() => handleDeleteImage(img.id)}
                              className={styles.deleteImageBtn}
                            >
                              Eliminar
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
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
                      <td>${Number.parseFloat(producto.precio).toLocaleString('es-CO')}</td>
                      <td>{producto.categoria}</td>
                      <td>
                        <button
                          type="button"
                          className={styles.editBtn}
                          onClick={() => handleEdit(producto)}
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          className={styles.deleteBtn}
                          onClick={() => handleDelete(producto.id)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* ==============================
              ADMINISTRAR TARJETAS (SERVICIOS)
             ============================== */}
          <div style={{ marginTop: '2.5rem' }}>
            <div className={styles.sectionHeader}>
              <h2>Tarjetas (Catálogo)</h2>
              <button
                type="button"
                className={styles.addBtn}
                onClick={handleCancelTarjeta}
                style={{ opacity: isEditingTarjeta ? 1 : 0.7 }}
              >
                {isEditingTarjeta ? 'Cancelar edición' : '+ Nueva Tarjeta'}
              </button>
            </div>

            <form className={styles.form} onSubmit={handleTarjetaSubmit}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="tarjetaTitulo">Título</label>
                  <input
                    id="tarjetaTitulo"
                    type="text"
                    value={tarjetaForm.titulo}
                    onChange={(e) => setTarjetaForm(prev => ({ ...prev, titulo: e.target.value }))}
                    required
                    placeholder="Ej: Cuadros Personalizados"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="tarjetaActivo">Estado</label>
                  <select
                    id="tarjetaActivo"
                    value={tarjetaForm.activa ? 'true' : 'false'}
                    onChange={(e) => setTarjetaForm(prev => ({ ...prev, activa: e.target.value === 'true' }))}
                  >
                    <option value="true">Pública</option>
                    <option value="false">Oculta</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="tarjetaRuta">Ruta de Destino (URL)</label>
                  <input
                    id="tarjetaRuta"
                    type="text"
                    value={tarjetaForm.ruta_destino}
                    onChange={(e) => setTarjetaForm(prev => ({ ...prev, ruta_destino: e.target.value }))}
                    required
                    placeholder="Ej: /catalogo?categoria=cuadros"
                  />
                </div>

                <div className={styles.formGroupFull}>
                  <label htmlFor="tarjetaDescripcion">Descripción</label>
                  <textarea
                    id="tarjetaDescripcion"
                    value={tarjetaForm.descripcion}
                    onChange={(e) => setTarjetaForm(prev => ({ ...prev, descripcion: e.target.value }))}
                    placeholder="Descripción de la tarjeta"
                    rows="3"
                  />
                </div>

                <div className={styles.formGroupFull}>
                  <label htmlFor="tarjetaImagen">Imagen</label>
                  <div className={styles.galeriaUpload}>
                    <input
                      id="tarjetaImagen"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImagenTarjeta(e.target.files[0])}
                      className={styles.fileInput}
                      required={!isEditingTarjeta}
                    />
                    <button type="submit" className={styles.uploadBtn} disabled={false}>
                      {isEditingTarjeta ? 'Actualizar' : 'Crear'}
                    </button>
                  </div>
                </div>
              </div>
            </form>

            <div className={styles.productsList} style={{ marginTop: '1.5rem' }}>
              {tarjetas.length === 0 ? (
                <p className={styles.empty}>No hay tarjetas creadas</p>
              ) : (
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Imagen</th>
                      <th>Título</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tarjetas.map((tarjeta) => (
                      <tr key={tarjeta.id}>
                        <td>{tarjeta.id}</td>
                        <td>
                          <img
                            src={tarjeta.imagen}
                            alt={tarjeta.nombre || tarjeta.titulo} // El backend devuelve 'nombre'
                            width="50"
                            style={{ borderRadius: '4px', objectFit: 'cover' }}
                          />
                        </td>
                        <td>{tarjeta.nombre || tarjeta.titulo}</td>
                        <td>{tarjeta.activo || tarjeta.activa ? 'Pública' : 'Oculta'}</td>
                        <td>
                          <button
                            type="button"
                            className={styles.editBtn}
                            onClick={() => handleEditTarjeta(tarjeta)}
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            className={styles.deleteBtn}
                            onClick={() => handleDeleteTarjeta(tarjeta.id)}
                            style={{ marginLeft: '10px' }}
                          >
                            Eliminar
                          </button>
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
    </div>
  );
}