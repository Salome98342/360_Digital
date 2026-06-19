import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { getCookie } from '../../src/utils/helpers';
import styles from '../../pages/AdminDashboard.module.css';

export default function ProductosView() {
  const [productos, setProductos] = useState([]);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Estados del formulario
  const [formData, setFormData] = useState({
    nombre: '', descripcion: '', precio: '', categoria: 'Tarjetas', especificaciones: []
  });
  const [deletedEspecificaciones, setDeletedEspecificaciones] = useState([]);
  const [galeriaImages, setGaleriaImages] = useState([]);
  const [imagenACargar, setImagenACargar] = useState(null);

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
      toast.error('Error al cargar la lista de productos');
    }
  }, []);

  useEffect(() => {
    cargarProductos();
  }, [cargarProductos]);

  const resetForm = () => {
    setFormData({ nombre: '', descripcion: '', precio: '', categoria: 'Tarjetas', especificaciones: [] });
    setGaleriaImages([]);
    setImagenACargar(null);
    setEditingId(null);
    setDeletedEspecificaciones([]);
    setShowFormModal(false);
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
    setShowFormModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este producto?')) return;
    
    const toastId = toast.loading('Eliminando producto...');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/productos/${id}/`, {
        method: 'DELETE', credentials: 'include'
      });

      if (!response.ok) throw new Error('Error al eliminar');
      
      toast.success('Producto eliminado exitosamente', { id: toastId });
      cargarProductos();
    } catch (err) {
      toast.error('Error al eliminar el producto', { id: toastId });
    }
  };

  const procesarEspecificaciones = async (productoId) => {
    // Eliminar las quitadas
    for (const especId of deletedEspecificaciones) {
      await fetch(`${import.meta.env.VITE_API_URL}/api/especificaciones/${especId}/`, {
        method: 'DELETE', headers: { 'X-CSRFToken': getCookie('csrftoken') }, credentials: 'include'
      });
    }
    // Guardar nuevas
    const nuevasEsp = formData.especificaciones.filter(esp => esp.nombre && esp.valor && !esp.id);
    for (const esp of nuevasEsp) {
      await fetch(`${import.meta.env.VITE_API_URL}/api/especificaciones/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRFToken': getCookie('csrftoken') },
        credentials: 'include',
        body: JSON.stringify({ id_producto: productoId, nombre: esp.nombre, valor: esp.valor })
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading(editingId ? 'Actualizando...' : 'Guardando producto...');

    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId 
        ? `${import.meta.env.VITE_API_URL}/api/productos/${editingId}/`
        : `${import.meta.env.VITE_API_URL}/api/productos/`;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'X-CSRFToken': getCookie('csrftoken') },
        credentials: 'include',
        body: JSON.stringify({
          nombre: formData.nombre,
          descripcion: formData.descripcion,
          precio: Number.parseFloat(formData.precio),
          categoria_nombre: formData.categoria
        })
      });

      if (!response.ok) throw new Error('Error en la petición');
      
      const productoData = await response.json();
      await procesarEspecificaciones(productoData.id);

      toast.success(editingId ? 'Producto actualizado' : 'Producto creado', { id: toastId });
      resetForm();
      cargarProductos();
    } catch (err) {
      toast.error('Error al guardar el producto', { id: toastId });
    }
  };

  // Funciones de formulario (onChange, agregarEspecificacion) omitidas por brevedad, 
  // usa exactamente las mismas que tenías en tu código original para el formData.
  const handleFormChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2>Gestión de Productos</h2>
        <button className={styles.addBtn} onClick={() => setShowFormModal(true)}>
          + Nuevo Producto
        </button>
      </div>

      {/* Modal Overlay para el Formulario */}
      {showFormModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>{editingId ? 'Editar Producto' : 'Crear Nuevo Producto'}</h3>
              <button onClick={resetForm} className={styles.closeModalBtn}>✕</button>
            </div>
            
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.formGrid}>
                {/* Campos del producto idénticos a los tuyos */}
                <div className={styles.formGroup}>
                  <label>Nombre</label>
                  <input type="text" name="nombre" value={formData.nombre} onChange={handleFormChange} required />
                </div>
                <div className={styles.formGroup}>
                  <label>Precio</label>
                  <input type="number" name="precio" value={formData.precio} onChange={handleFormChange} required step="0.01" />
                </div>
                <div className={styles.formGroup}>
                  <label>Categoría</label>
                  <select name="categoria" value={formData.categoria} onChange={handleFormChange}>
                    <option value="Tarjetas">Tarjetas</option>
                    <option value="Volantes">Volantes</option>
                    <option value="Pendones">Pendones</option>
                    <option value="Cuadros">Cuadros</option>
                    <option value="Identidad">Identidad</option>
                    <option value="Cuadros Personalizados">Cuadros Personalizados</option>
                    <option value="Posters">Posters</option>
                    <option value="Avisos Luminosos">Avisos Luminosos</option>
                    <option value="Pendones y Estructuras">Pendones y Estructuras</option>
                    <option value="Otros">Otros</option>

                    {/* Resto de opciones... */}
                  </select>
                </div>
                <div className={styles.formGroupFull}>
                  <label>Descripción</label>
                  <textarea name="descripcion" value={formData.descripcion} onChange={handleFormChange} rows="3" />
                </div>
              </div>
              <div className={styles.modalActions}>
                <button type="button" onClick={resetForm} className={styles.cancelBtn}>Cancelar</button>
                <button type="submit" className={styles.submitBtn}>
                  {editingId ? 'Actualizar Producto' : 'Guardar Producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tabla de productos */}
      <div className={styles.productsList}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th><th>Nombre</th><th>Precio</th><th>Categoría</th><th>Acciones</th>
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
                  <button onClick={() => handleEdit(producto)} className={styles.editBtn}>Editar</button>
                  <button onClick={() => handleDelete(producto.id)} className={styles.deleteBtn}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}