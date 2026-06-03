import { useState } from 'react';
import styles from './FilterSidebar.module.css';

export default function FilterSidebar({ onFilterChange, activeFilters }) {
  const [expandedCategories, setExpandedCategories] = useState({
    categories: true,
    priceRange: true,
    rating: true,
  });

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const categories = [
    'Todas',
    'Tarjetas',
    'Pendones',
    'Cuadros',
    'Logos',
    'Empaques',
    'Identidad',
    'Volantes',
    'Posters'
  ];

  const ratings = [
    { stars: 5, label: '5 Stars' },
    { stars: 4, label: '4+ Stars' },
    { stars: 3, label: '3+ Stars' },
    { stars: 2, label: '2+ Stars' },
    { stars: 1, label: '1+ Stars' },
  ];

  return (
    <aside className={styles.sidebar}>
      {/* CATEGORIES */}
      <div className={styles.filterGroup}>
        <button 
          className={styles.filterTitle}
          onClick={() => toggleCategory('categories')}
        >
          <span>Categorías</span>
          <span>{expandedCategories.categories ? '−' : '+'}</span>
        </button>
        {expandedCategories.categories && (
          <div className={styles.filterOptions}>
            {categories.map(cat => (
              <label key={cat} className={styles.filterOption}>
                <input 
                  type="checkbox"
                  checked={activeFilters.categories?.includes(cat)}
                  onChange={() => onFilterChange('categories', cat)}
                />
                <span>{cat}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* PRICE RANGE */}
      <div className={styles.filterGroup}>
        <button 
          className={styles.filterTitle}
          onClick={() => toggleCategory('priceRange')}
        >
          <span>Rango de Precio</span>
          <span>{expandedCategories.priceRange ? '−' : '+'}</span>
        </button>
        {expandedCategories.priceRange && (
          <div className={styles.priceRange}>
            <input 
              type="range" 
              min="0" 
              max="250000"
              className={styles.slider}
              onChange={(e) => onFilterChange('price', e.target.value)}
            />
            <div className={styles.priceLabel}>
              Hasta: <strong>${activeFilters.price || 250000}</strong>
            </div>
          </div>
        )}
      </div>

      {/* RATING */}
      <div className={styles.filterGroup}>
        <button 
          className={styles.filterTitle}
          onClick={() => toggleCategory('rating')}
        >
          <span>Rating</span>
          <span>{expandedCategories.rating ? '−' : '+'}</span>
        </button>
        {expandedCategories.rating && (
          <div className={styles.filterOptions}>
            {ratings.map(r => (
              <label key={r.stars} className={styles.filterOption}>
                <input 
                  type="checkbox"
                  checked={activeFilters.rating?.includes(r.stars)}
                  onChange={() => onFilterChange('rating', r.stars)}
                />
                <span className={styles.ratingStars}>
                  {'★'.repeat(r.stars)}{'☆'.repeat(5-r.stars)}
                </span>
                <span>{r.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* CLEAR FILTERS */}
      {Object.values(activeFilters).some(filter => filter && filter.length > 0) && (
        <button 
          className={styles.clearButton}
          onClick={() => onFilterChange('clear', null)}
        >
          Limpiar Filtros
        </button>
      )}
    </aside>
  );
}
