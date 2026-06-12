import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AdminDashboard.module.css';

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

  useEffect(() => {
    verificarAutenticacion();
    cargarProductos();
  }, []);

  const verificarAutenticacion = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/usuarios/autenticacion/check_auth/`, {

        method: 'GET',
        credentials: 'include'
      });

      if (!response.ok) {
        navigate('/admin/login');
        return;
      }

      // Obtener datos del admin
      const meResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/usuarios/autenticacion/me/`, {
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
  };

  // Función auxiliar para obtener el token CSRF de las cookies
  const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  };

  const handleLogout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/usuarios/autenticacion/logout/`, {
        method: 'POST',
        headers: { 'X-CSRFToken': getCookie('csrftoken') },
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
    // Si la especificación tiene id, significa que existe en el backend y debe ser eliminada
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
    if (!window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
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
      console.error('Error:', err);
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
        precio: parseFloat(formData.precio),
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
        console.error('Error response:', errorData);
        return;
      }

      const productoData = await response.json();

      // Eliminar especificaciones que fueron removidas
      if (deletedEspecificaciones.length > 0) {
        for (const especId of deletedEspecificaciones) {
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

      // Guardar especificaciones nuevas
      if (formData.especificaciones.length > 0) {
        for (const esp of formData.especificaciones) {
          // Solo crear especificaciones nuevas (sin id)
          if (esp.nombre && esp.valor && !esp.id) {
            await fetch(`${import.meta.env.VITE_API_URL}/api/especificaciones/`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
              },
              credentials: 'include',
              body: JSON.stringify({
                id_producto: productoData.id,
                nombre: esp.nombre,
                valor: esp.valor
              })
            });
          }
        }
      }

      setSuccess(editingId ? 'Producto actualizado exitosamente' : 'Producto creado exitosamente');
      resetForm();
      setShowForm(false);
      cargarProductos();
    } catch (err) {
      setError('Error: ' + err.message);
      console.error('Error:', err);
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

      console.log('Subiendo imagen para producto:', editingId);
      console.log('Archivo:', imagenACargar);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/productos/${editingId}/upload_image/`, {
        method: 'POST',
        headers: { 'X-CSRFToken': getCookie('csrftoken') },
        credentials: 'include',
        body: formDataImg
      });

      console.log('Response status:', response.status);
      const responseData = await response.json();
      console.log('Response data:', responseData);

      if (!response.ok) {
        setError(`Error al subir imagen: ${JSON.stringify(responseData)}`);
        return;
      }

      const nuevaImagen = responseData;
      setGaleriaImages([...galeriaImages, nuevaImagen]);
      setImagenACargar(null);
      setSuccess('Imagen subida exitosamente');
      
      // Limpiar el input file
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
    } catch (err) {
      console.error('Error catch:', err);
      setError('Error al subir imagen: ' + err.message);
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta imagen?')) {
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
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logoMark} aria-hidden="true" />
          <div>
            <span className={styles.kicker}>360 Digital</span>
            <h1>Panel administrador</h1>
          </div>
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

          {/* Formulario */}
          {(showForm || editingId) && (
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
                    <option value="Tarjetas">Tarjetas</option>
                    <option value="Volantes">Volantes</option>
                    <option value="Cuadros">Cuadros</option>
                    <option value="Empaques">Empaques</option>
                    <option value="Identidad">Identidad</option>
                    <option value="Logos">Logos</option>
                    <option value="Pendones">Pendones</option>
                    <option value="Posters">Posters</option>
                  </select>
                </div>

                <div className={styles.formGroupFull}>
                  <label>Descripción</label>
                  <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleFormChange}
                    placeholder="Descripción del producto"
                    rows="3"
                  ></textarea>
                </div>

                {/* Especificaciones */}
                <div className={styles.formGroupFull}>
                  <label>Especificaciones</label>
                  <div className={styles.especificaciones}>
                    {formData.especificaciones.map((esp, index) => (
                      <div key={index} className={styles.especRow}>
                        <input
                          type="text"
                          placeholder="Ej: Tamaño"
                          value={esp.nombre}
                          onChange={(e) => handleEspecificacionChange(index, 'nombre', e.target.value)}
                          className={styles.especNombre}
                        />
                        <input
                          type="text"
                          placeholder="Ej: A4"
                          value={esp.valor}
                          onChange={(e) => handleEspecificacionChange(index, 'valor', e.target.value)}
                          className={styles.especValor}
                        />
                        <button
                          type="button"
                          onClick={() => removeEspecificacion(index)}
                          className={styles.removeBtn}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={addEspecificacion}
                    className={styles.addEspecBtn}
                  >
                    + Agregar especificación
                  </button>
                </div>

                {/* Galería de Imágenes - Solo cuando edita */}
                {editingId && (
                  <div className={styles.formGroupFull}>
                    <label>Galería de Imágenes</label>
                    <div className={styles.galeriaUpload}>
                      <input
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

                    {/* Galería actual */}
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
                      <td>${parseFloat(producto.precio).toLocaleString('es-CO')}</td>
                      <td>{producto.categoria}</td>
                      <td>
                        <button
                          className={styles.editBtn}
                          onClick={() => handleEdit(producto)}
                        >
                          Editar
                        </button>
                        <button
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
        </div>
      </div>
    </div>
  );
}
