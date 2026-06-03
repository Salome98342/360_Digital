import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header/Header.jsx';
import styles from './Catalog.module.css';
import FilterSidebar from '../components/FilterSidebar/FilterSidebar';
import ProductCard from '../components/ProductCard/ProductCard';

const imageMap = {
  1: 'https://images.unsplash.com/photo-1611532736579-6b16e2b50449?w=400&h=300&fit=crop',
  2: 'https://images.unsplash.com/photo-1460925895917-adf4e565f900?w=400&h=300&fit=crop',
  3: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop',
  4: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
  5: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop',
  6: 'https://images.unsplash.com/photo-1611532736579-6b16e2b50449?w=400&h=300&fit=crop',
  7: 'https://images.unsplash.com/photo-1460925895917-adf4e565f900?w=400&h=300&fit=crop',
  8: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop'
};

export default function Catalog() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    categories: [],
    price: 250000,
    rating: []
  });
  const [sortBy, setSortBy] = useState('relevance');
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar productos desde la API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8000/api/productos/');
        const data = await response.json();
        
        console.log('API Response:', data);
        console.log('Results array:', data.results);
        
        // Mapear datos de la API al formato esperado por el componente
        const mappedProducts = data.results.map(product => ({
          id: product.id,
          title: product.nombre,
          category: product.categoria,
          price: parseFloat(product.precio),
          rating: 4.5, // Rating por defecto, se actualiza en ProductDetail
          image: imageMap[product.id] || 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
          description: product.descripcion
        }));
        
        console.log('Mapped products:', mappedProducts);
        setAllProducts(mappedProducts);
      } catch (error) {
        console.error('Error al cargar productos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filtrar y buscar productos
  const filteredProducts = useMemo(() => {
    let results = allProducts;

    // Búsqueda por término
    if (searchTerm) {
      results = results.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por categoría
    if (activeFilters.categories.length > 0 && !activeFilters.categories.includes('Todas')) {
      results = results.filter(p => activeFilters.categories.includes(p.category));
    }

    // Filtro por precio
    results = results.filter(p => p.price <= activeFilters.price);

    // Filtro por rating
    if (activeFilters.rating.length > 0) {
      results = results.filter(p =>
        activeFilters.rating.some(r => p.rating >= r)
      );
    }

    // Ordenar
    switch (sortBy) {
      case 'price-low':
        results.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        results.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        results.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        results.reverse();
        break;
      default:
        break;
    }

    return results;
  }, [searchTerm, activeFilters, sortBy, allProducts]);

  const handleFilterChange = (filterType, value) => {
    if (filterType === 'clear') {
      setActiveFilters({ categories: [], price: 250000, rating: [] });
    } else if (filterType === 'categories') {
      setActiveFilters(prev => ({
        ...prev,
        categories: prev.categories.includes(value)
          ? prev.categories.filter(c => c !== value)
          : [...prev.categories, value]
      }));
    } else if (filterType === 'price') {
      setActiveFilters(prev => ({ ...prev, price: parseInt(value) }));
    } else if (filterType === 'rating') {
      setActiveFilters(prev => ({
        ...prev,
        rating: prev.rating.includes(value)
          ? prev.rating.filter(r => r !== value)
          : [...prev.rating, value]
      }));
    }
  };

  return (
    <div className={styles.catalogContainer}>
      <Header />
      
      {/* Header del Catálogo */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Catálogo</h1>
          <p>Explora nuestros trabajos en diseño gráfico, identidad corporativa y materiales de marketing</p>
        </div>
      </div>

      {/* Search y Sort */}
      <div className={styles.topBar}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Buscar servicios..."
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
            <option value="relevance">Relevancia</option>
            <option value="price-low">Menor Precio</option>
            <option value="price-high">Mayor Precio</option>
            <option value="rating">Mejor Rating</option>
            <option value="newest">Más Recientes</option>
          </select>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Sidebar */}
        <FilterSidebar 
          onFilterChange={handleFilterChange}
          activeFilters={activeFilters}
        />

        {/* Productos Grid */}
        <div className={styles.productsSection}>
          {loading ? (
            <div className={styles.loading}>
              <p>Cargando productos...</p>
            </div>
          ) : (
            <>
              <div className={styles.resultsInfo}>
                <span>Mostrando {filteredProducts.length} de {allProducts.length} resultados</span>
              </div>

              {filteredProducts.length > 0 ? (
                <div className={styles.productsGrid}>
                  {filteredProducts.map(product => (
                    <Link key={product.id} to={`/producto/${product.id}`} className={styles.productCardLink}>
                      <ProductCard 
                        product={product}
                      />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className={styles.noResults}>
                  <h3>No se encontraron resultados</h3>
                  <p>Intenta ajustar los filtros o términos de búsqueda</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
