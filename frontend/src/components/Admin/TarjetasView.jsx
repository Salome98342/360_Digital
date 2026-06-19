import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { getCookie } from '../../src/utils/helpers';
import styles from '../../pages/AdminDashboard.module.css';

export default function TarjetasView() {
  const [tarjetas, setTarjetas] = useState([]);
  const [showFormModal, setShowFormModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [imagenTarjeta, setImagenTarjeta] = useState(null);
  const [formData, setFormData] = useState({
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
      if (response.ok) {
        const data = await response.json();
        setTarjetas(data.results || data);
      }
    } catch (err) {
      toast.error('Error al cargar tarjetas');
    }
  }, []);

  useEffect(() => {
    cargarTarjetas();
  }, [cargarTarjetas]);

  const resetForm = () => {
    setFormData({ id: '', titulo: '', descripcion: '', activa: true, ruta_destino: '' });
    setImagenTarjeta(null);
    setIsEditing(false);
    setShowFormModal(false);
  };

  const handleEdit = (tarjeta) => {
    setIsEditing(true);
    setFormData({
      id: tarjeta.id,
      titulo: tarjeta.nombre || tarjeta.titulo || '',
      descripcion: tarjeta.descripcion || '',
      activa: !!tarjeta.activo,
      ruta_destino: tarjeta.ruta_destino || ''
    });
    setImagenTarjeta(null);
    setShowFormModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar esta tarjeta?')) return;
    const toastId = toast.loading('Eliminando...');
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/servicios/${id}/`, {
        method: 'DELETE',
        headers: { 'X-CSRFToken': getCookie('csrftoken') },
        credentials: 'include'
      });
      toast.success('Tarjeta eliminada', { id: toastId });
      cargarTarjetas();
    } catch (err) {
      toast.error('Error al eliminar', { id: toastId });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading('Guardando tarjeta...');

    const payload = new FormData();
    // Match con backend (nombre/descripcion/activo/ruta_destino)
    payload.append('nombre', formData.titulo);
    payload.append('descripcion', formData.descripcion);
    payload.append('activo', formData.activa);
    payload.append('ruta_destino', formData.ruta_destino);
    if (imagenTarjeta) payload.append('imagen', imagenTarjeta);

    const url = isEditing
      ? `${import.meta.env.VITE_API_URL}/api/servicios/${formData.id}/`
      : `${import.meta.env.VITE_API_URL}/api/servicios/`;

    try {
      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'X-CSRFToken': getCookie('csrftoken') },
        credentials: 'include',
        body: payload
      });

      if (!response.ok) throw new Error('Error al guardar');

      toast.success(isEditing ? 'Tarjeta actualizada' : 'Tarjeta creada', { id: toastId });
      resetForm();
      cargarTarjetas();
    } catch (err) {
      toast.error('Error guardando tarjeta', { id: toastId });
    }
  };

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2>Tarjetas (Catálogo)</h2>
        <button className={styles.addBtn} onClick={() => setShowFormModal(true)}>
          + Nueva Tarjeta
        </button>
      </div>

      {showFormModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>{isEditing ? 'Editar Tarjeta' : 'Crear Nueva Tarjeta'}</h3>
              <button onClick={resetForm} className={styles.closeModalBtn}>
                ✕
              </button>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>Título</label>
                  <input
                    type="text"
                    value={formData.titulo}
                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                    required
                    placeholder="Ej: Cuadros Personalizados"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Estado</label>
                  <select
                    value={formData.activa}
                    onChange={(e) => setFormData({ ...formData, activa: e.target.value === 'true' })}
                  >
                    <option value={true}>Pública</option>
                    <option value={false}>Oculta</option>
                  </select>
                </div>

                <div className={styles.formGroupFull}>
                  <label>Descripción</label>
                  <textarea
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    rows="3"
                    placeholder="Descripción de la tarjeta"
                  />
                </div>

                <div className={styles.formGroupFull}>
                  <label>URL / Ruta de destino (ruta_destino)</label>
                  <input
                    type="text"
                    value={formData.ruta_destino}
                    onChange={(e) => setFormData({ ...formData, ruta_destino: e.target.value })}
                    required
                    placeholder="Ej: /catalogo?categoria=cuadros"
                  />
                </div>

                <div className={styles.formGroupFull}>
                  <label>Imagen</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImagenTarjeta(e.target.files[0])}
                  />
                </div>
              </div>

              <div className={styles.modalActions}>
                <button type="button" onClick={resetForm} className={styles.cancelBtn}>
                  Cancelar
                </button>
                <button type="submit" className={styles.submitBtn}>
                  Guardar Tarjeta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className={styles.productsList}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Estado</th>
              <th>Ruta</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tarjetas.map((t) => (
              <tr key={t.id}>
                <td>{t.id}</td>
                <td>{t.nombre || t.titulo}</td>
                <td>{t.activo ? 'Pública' : 'Oculta'}</td>
                <td style={{ maxWidth: 320, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {t.ruta_destino || ''}
                </td>
                <td>
                  <button onClick={() => handleEdit(t)} className={styles.editBtn}>
                    Editar
                  </button>
                  <button onClick={() => handleDelete(t.id)} className={styles.deleteBtn}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
