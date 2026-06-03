import styles from './ProductCard.module.css';

const formatPrice = (price) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};

export default function ProductCard({ product }) {
  return (
    <div className={styles.productCard}>
      <div className={styles.imageContainer}>
        {/* Aquí irá la imagen del producto */}
        <img src={product.image} alt={product.title} className={styles.productImage} />
        {product.discount && (
          <div className={styles.discountBadge}>{product.discount}% off</div>
        )}
      </div>
      
      <div className={styles.productInfo}>
        <p className={styles.category}>{product.category}</p>
        
        <h3 className={styles.productTitle}>{product.title}</h3>
        
        <div className={styles.rating}>
          <div className={styles.stars}>
            {'★'.repeat(Math.floor(product.rating))}
            {'☆'.repeat(5 - Math.floor(product.rating))}
          </div>
          <span className={styles.ratingText}>{product.rating}</span>
        </div>
        
        <div className={styles.priceContainer}>
          <span className={styles.price}>{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className={styles.originalPrice}>{formatPrice(product.originalPrice)}</span>
          )}
        </div>
      </div>
    </div>
  );
}
