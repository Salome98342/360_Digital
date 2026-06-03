import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header/Header.jsx';
import styles from './ProductDetail.module.css';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({
    nombre_cliente: '',
    puntuacion: 5,
    comentario: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar producto del backend
  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8000/api/productos/${id}/`);
      if (!response.ok) {
        navigate('/catalogo');
        return;
      }
      const data = await response.json();
      setProduct(data);
      setReviews(data.resenas || []);
    } catch (error) {
      console.error('Error al cargar producto:', error);
      navigate('/catalogo');
    } finally {
      setLoading(false);
    }
  };

  // Cargar favoritos del localStorage al montar el componente
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setIsFavorite(favorites.includes(parseInt(id)));
  }, [id]);

  // Manejar cambios en el formulario de reseña
  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReviewForm(prev => ({
      ...prev,
      [name]: name === 'puntuacion' ? parseInt(value) : value
    }));
  };

  // Enviar nueva reseña
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!reviewForm.nombre_cliente.trim() || !reviewForm.comentario.trim()) {
      alert('Por favor completa todos los campos');
      return;
    }

    setIsSubmitting(true);

    try {
      // Hacer POST al backend
      const response = await fetch(`http://localhost:8000/api/productos/${id}/resenas/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_producto: parseInt(id),
          nombre_cliente: reviewForm.nombre_cliente,
          puntuacion: reviewForm.puntuacion,
          comentario: reviewForm.comentario
        })
      });

      if (response.ok) {
        const newReview = await response.json();
        setReviews([newReview, ...reviews]);
        setReviewForm({
          nombre_cliente: '',
          puntuacion: 5,
          comentario: ''
        });
        alert('¡Reseña publicada exitosamente!');
      } else {
        alert('Error al publicar la reseña');
      }
    } catch (error) {
      console.error('Error al enviar reseña:', error);
      alert('Error de conexión. Intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Función para agregar/quitar de favoritos
  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    if (isFavorite) {
      // Quitar de favoritos
      const updated = favorites.filter(fav => fav !== parseInt(id));
      localStorage.setItem('favorites', JSON.stringify(updated));
    } else {
      // Agregar a favoritos
      favorites.push(parseInt(id));
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }
    
    setIsFavorite(!isFavorite);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <Header />
        <div className={styles.loading}>
          <p>Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className={styles.container}>
        <Header />
        <div className={styles.notFound}>
          <h2>Producto no encontrado</h2>
          <Link to="/catalogo" className={styles.backButton}>
            Volver al Catálogo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Header />

      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <Link to="/catalogo">Catálogo</Link>
        <span>/</span>
        <span>{product.nombre}</span>
      </div>

      {/* Product Detail */}
      <div className={styles.productDetail}>
        {/* Left - Images */}
        <div className={styles.leftColumn}>
          <div className={styles.mainImage}>
            <img src={product.galeria?.[0]?.url_imagen || 'https://via.placeholder.com/800x600'} alt={product.nombre} />
          </div>
          <div className={styles.thumbnails}>
            {product.galeria?.map((img, idx) => (
              <img
                key={idx}
                src={img.url_imagen}
                alt={`Vista ${idx + 1}`}
                className={styles.thumbnail}
              />
            ))}
          </div>
        </div>

        {/* Right - Info */}
        <div className={styles.rightColumn}>
          {/* Category */}
          <p className={styles.category}>{product.categoria}</p>

          {/* Title */}
          <h1 className={styles.title}>{product.nombre}</h1>

          {/* Rating */}
          <div className={styles.rating}>
            <div className={styles.stars}>
              {'★'.repeat(Math.floor(product.rating))}
              {'☆'.repeat(5 - Math.floor(product.rating))}
            </div>
            <span className={styles.ratingValue}>{product.rating}</span>
            <span className={styles.reviews}>({reviews.length} reseñas)</span>
          </div>

          {/* Price */}
          <div className={styles.price}>${product.precio}</div>

          {/* Description */}
          <p className={styles.description}>{product.descripcion}</p>

          {/* Specifications */}
          <div className={styles.specs}>
            {product.especificaciones && Object.entries(product.especificaciones).map(([key, value]) => (
              <div key={key} className={styles.specItem}>
                <span className={styles.specLabel}>{key.charAt(0).toUpperCase() + key.slice(1)}:</span>
                <span className={styles.specValue}>{value}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className={styles.actions}>
            <button className={styles.primaryButton}>Solicitar Cotización</button>
            <button 
              className={`${styles.secondaryButton} ${isFavorite ? styles.favorited : ''}`}
              onClick={toggleFavorite}
            >
              {isFavorite ? '♥ En Favoritos' : '♡ Agregar a Favoritos'}
            </button>
          </div>
        </div>
      </div>

      {/* RESEÑAS Y COMENTARIOS */}
      <div className={styles.reviewsSection}>
        <div className={styles.reviewsContainer}>
          <h2>Reseñas y Comentarios</h2>

          {/* Formulario para dejar reseña */}
          <div className={styles.reviewForm}>
            <h3>Deja tu reseña</h3>
            <form onSubmit={handleSubmitReview}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="nombre_cliente">Nombre *</label>
                  <input
                    type="text"
                    id="nombre_cliente"
                    name="nombre_cliente"
                    value={reviewForm.nombre_cliente}
                    onChange={handleReviewChange}
                    placeholder="Tu nombre"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="puntuacion">Puntuación *</label>
                  <select
                    id="puntuacion"
                    name="puntuacion"
                    value={reviewForm.puntuacion}
                    onChange={handleReviewChange}
                  >
                    <option value="5">⭐⭐⭐⭐⭐ Excelente</option>
                    <option value="4">⭐⭐⭐⭐ Muy Bueno</option>
                    <option value="3">⭐⭐⭐ Bueno</option>
                    <option value="2">⭐⭐ Regular</option>
                    <option value="1">⭐ Pobre</option>
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="comentario">Comentario *</label>
                <textarea
                  id="comentario"
                  name="comentario"
                  value={reviewForm.comentario}
                  onChange={handleReviewChange}
                  placeholder="Cuéntanos tu experiencia con este producto..."
                  rows="4"
                  required
                />
              </div>

              <button 
                type="submit" 
                className={styles.submitReviewBtn}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Enviando...' : 'Publicar Reseña'}
              </button>
            </form>
          </div>

          {/* Lista de reseñas */}
          <div className={styles.reviewsList}>
            <h3>Comentarios ({reviews.length})</h3>
            
            {reviews.length === 0 ? (
              <p className={styles.noReviews}>
                No hay reseñas aún. ¡Sé el primero en dejar una!
              </p>
            ) : (
              reviews.map((review, index) => (
                <div key={index} className={styles.reviewItem}>
                  <div className={styles.reviewHeader}>
                    <h4>{review.nombre_cliente}</h4>
                    <div className={styles.reviewStars}>
                      {'★'.repeat(review.puntuacion)}
                      {'☆'.repeat(5 - review.puntuacion)}
                    </div>
                  </div>
                  <p className={styles.reviewDate}>
                    {new Date(review.fecha_resena).toLocaleDateString('es-ES')}
                  </p>
                  <p className={styles.reviewComment}>{review.comentario}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
