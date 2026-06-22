import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header/Header.jsx';
import styles from './CatalogPaints.module.css';
import ProductCard from '../components/ProductCard/ProductCard';

export default function CatalogPaints() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar productos desde la API (Solo cuadros personalizados)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/productos/?id_categoria__nombre=Cuadros+Personalizados`);
        const data = await response.json();
        
        const productsList = data.results || data;
        
        const mappedProducts = productsList.map(product => ({
          id: product.id,
          title: product.nombre,
          category: product.categoria,
          price: Number.parseFloat(product.precio),
          rating: 5.0,
          image: product.galeria?.[0]?.url_imagen || '', 
          description: product.descripcion
        }));
        
        setAllProducts(mappedProducts);
      } catch (error) {
        console.error('Error al cargar cuadros:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filtrar por búsqueda y ordenar
  const filteredProducts = useMemo(() => {
    let results = allProducts;

    // Búsqueda por término (nombre del cuadro)
    if (searchTerm) {
      results = results.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Ordenar
    switch (sortBy) {
      case 'price-low':
        results = [...results].sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        results = [...results].sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        results = [...results].reverse();
        break;
      default:
        break;
    }

    return results;
  }, [searchTerm, sortBy, allProducts]);

  return (
    <div className={styles.catalogContainer}>
      <Header />
      
      {/* Header del Catálogo */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Galería de Cuadros</h1>
          <p>Explora nuestras obras y dale vida a tus espacios</p>
        </div>
      </div>

      {/* Buscador y Ordenador */}
      <div className={styles.topBar}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Buscar cuadro..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className={styles.searchIcon}>🔍</span>
        </div>

        <div className={styles.sortContainer}>
          <label>Ordenar por:</label>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className={styles.sortSelect}
          >
            <option value="newest">Más Recientes</option>
            <option value="price-low">Menor Precio</option>
            <option value="price-high">Mayor Precio</option>
          </select>
        </div>
      </div>

      {/* Contenido Principal (Sin Sidebar, ancho completo) */}
      {/* Nota: style={{ display: 'block' }} asegura que anulemos cualquier grid viejo del sidebar */}
      <div className={styles.mainContent} style={{ display: 'block', padding: '20px 0' }}>
        
        <div className={styles.productsSection} style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
          {loading ? (
            <div className={styles.loading}>
              <p>Cargando galería...</p>
            </div>
          ) : (
            <>
              <div className={styles.resultsInfo} style={{ marginBottom: '20px' }}>
                <span>Mostrando {filteredProducts.length} cuadros</span>
              </div>

              {filteredProducts.length > 0 ? (
                <div className={styles.productsGrid}>
                  {filteredProducts.map(product => (
                    <Link key={product.id} to={`/producto/${product.id}`} className={styles.productCardLink}>
                      <ProductCard product={product} />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className={styles.noResults} style={{ textAlign: 'center', padding: '50px 0' }}>
                  <h3>No se encontraron cuadros</h3>
                  <p>Intenta con otro término de búsqueda</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}