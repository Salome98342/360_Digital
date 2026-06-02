import { useParams, useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header/Header.jsx';
import styles from './ProductDetail.module.css';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Productos del portafolio
  const allProducts = [
    {
      id: 1,
      title: 'Tarjetas de Presentación - Diseño Premium',
      category: 'Tarjetas',
      image: 'https://images.unsplash.com/photo-1611532736579-6b16e2b50449?w=800&h=600&fit=crop',
      rating: 5,
      reviews: 24,
      description: 'Tarjetas de presentación de diseño moderno y elegante con acabado mate y detalles en relieve. Perfectas para representar tu marca profesional.',
      dimensions: '85 x 55 mm',
      material: 'Cartulina 300 gsm',
      finish: 'Mate con laminado',
      production: '500 unidades',
      price: 250,
      images: [
        'https://images.unsplash.com/photo-1611532736579-6b16e2b50449?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop'
      ],
      details: {
        diseño: 'Minimalista con líneas geométricas',
        colores: 'Rojo corporativo, blanco y negro',
        tipografía: 'Anton y League Spartan',
        usos: 'Profesional, corporativo, negocios'
      }
    },
    {
      id: 2,
      title: 'Pendón Publicitario - 3x2 metros',
      category: 'Pendones',
      image: 'https://images.unsplash.com/photo-1460925895917-adf4e565f900?w=800&h=600&fit=crop',
      rating: 4.9,
      reviews: 18,
      description: 'Pendón de lona vinílica para exterior con diseño impactante. Ideal para promociones y eventos. Incluye ojetes reforzados.',
      dimensions: '3 x 2 metros',
      material: 'Lona vinílica 440 gsm',
      finish: 'Impresión DTG de alto brillo',
      production: '1 unidad',
      price: 450,
      images: [
        'https://images.unsplash.com/photo-1460925895917-adf4e565f900?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop'
      ],
      details: {
        diseño: 'Llamativo con elementos dinámicos',
        colores: 'Rojo, amarillo, blanco y negro',
        resolución: '300 DPI',
        usos: 'Publicidad, eventos, tiendas'
      }
    },
    {
      id: 3,
      title: 'Cuadro Corporativo - Canvas 60x80 cm',
      category: 'Cuadros',
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop',
      rating: 5,
      reviews: 12,
      description: 'Cuadro decorativo en canvas de alta calidad con impresión gráfica. Perfecto para oficinas y espacios corporativos.',
      dimensions: '60 x 80 cm',
      material: 'Canvas 100% algodón',
      finish: 'Impresión inkjet de archivo',
      production: '1 unidad',
      price: 320,
      images: [
        'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop'
      ],
      details: {
        diseño: 'Abstracto y moderno',
        colores: 'Degradado rojo a amarillo',
        técnica: 'Impresión gráfica',
        usos: 'Decoración, oficinas, salas'
      }
    },
    {
      id: 4,
      title: 'Diseño de Logo - Paquete Completo',
      category: 'Logos',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
      rating: 4.95,
      reviews: 31,
      description: 'Diseño de logo profesional con múltiples variaciones. Incluye versión horizontal, vertical, isotipo y aplicaciones.',
      dimensions: 'Escalable',
      material: 'Digital (AI, PDF, PNG)',
      finish: 'Alta definición',
      production: '1 paquete',
      price: 500,
      images: [
        'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop'
      ],
      details: {
        diseño: 'Geométrico y minimalista',
        colores: 'Rojo principal con variantes monocromáticas',
        entregables: 'Logo, isotipo, guía de marca básica',
        usos: 'Branding, identidad corporativa'
      }
    },
    {
      id: 5,
      title: 'Empaque de Producto - Caja Kraft',
      category: 'Empaques',
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=600&fit=crop',
      rating: 4.8,
      reviews: 15,
      description: 'Caja de empaque personalizada en kraft con diseño impreso. Estructura resistente y diseño atractivo.',
      dimensions: '25 x 20 x 10 cm',
      material: 'Cartón kraft corrugado',
      finish: 'Impresión a 4 colores',
      production: '1000 unidades',
      price: 800,
      images: [
        'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=600&fit=crop'
      ],
      details: {
        diseño: 'Ecológico con detalles minimalistas',
        colores: 'Kraft natural con impresión en rojo y negro',
        estructura: 'Caja armable',
        usos: 'E-commerce, regalos, productos'
      }
    },
    {
      id: 6,
      title: 'Identidad Corporativa Completa',
      category: 'Identidad',
      image: 'https://images.unsplash.com/photo-1611532736579-6b16e2b50449?w=800&h=600&fit=crop',
      rating: 5,
      reviews: 22,
      description: 'Paquete completo de identidad visual: logo, paleta cromática, tipografía y aplicaciones en múltiples formatos.',
      dimensions: 'Multipropósito',
      material: 'Digital + Impresión',
      finish: 'Profesional',
      production: '1 paquete',
      price: 1200,
      images: [
        'https://images.unsplash.com/photo-1611532736579-6b16e2b50449?w=800&h=600&fit=crop'
      ],
      details: {
        diseño: 'Estratégico y coherente',
        colores: 'Paleta de 5 colores principales',
        entregables: 'Logo, guía de marca, aplicaciones',
        usos: 'Branding integral'
      }
    },
    {
      id: 7,
      title: 'Volante Doblado A4 - 1000 unidades',
      category: 'Volantes',
      image: 'https://images.unsplash.com/photo-1460925895917-adf4e565f900?w=800&h=600&fit=crop',
      rating: 4.7,
      reviews: 10,
      description: 'Volantes en papel couché doblados por la mitad. Diseño atractivo con información clara y llamada a acción.',
      dimensions: 'A4 doblado (10.5 x 21 cm)',
      material: 'Papel couché 150 gsm',
      finish: 'Brillo con laminado suave',
      production: '1000 unidades',
      price: 180,
      images: [
        'https://images.unsplash.com/photo-1460925895917-adf4e565f900?w=800&h=600&fit=crop'
      ],
      details: {
        diseño: 'Informativo y directo',
        colores: 'Full color (CMYK)',
        layout: 'Frente y reverso personalizados',
        usos: 'Promoción, información, publicidad'
      }
    },
    {
      id: 8,
      title: 'Póster Decorativo - 70x100 cm',
      category: 'Posters',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
      rating: 4.9,
      reviews: 19,
      description: 'Póster artístico en papel satinado de alta calidad. Ideal para galerías, oficinas y espacios creativos.',
      dimensions: '70 x 100 cm',
      material: 'Papel satinado 150 gsm',
      finish: 'Satinado premium',
      production: '1 unidad',
      price: 95,
      images: [
        'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop'
      ],
      details: {
        diseño: 'Artístico y moderno',
        colores: 'Variación de colores vibrantes',
        técnica: 'Ilustración digital',
        usos: 'Decoración, eventos, espacios'
      }
    }
  ];

  const product = allProducts.find(p => p.id === parseInt(id));

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
        <span>{product.title}</span>
      </div>

      {/* Product Detail */}
      <div className={styles.productDetail}>
        {/* Left - Images */}
        <div className={styles.leftColumn}>
          <div className={styles.mainImage}>
            <img src={product.image} alt={product.title} />
          </div>
          <div className={styles.thumbnails}>
            {product.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`View ${idx + 1}`}
                className={styles.thumbnail}
              />
            ))}
          </div>
        </div>

        {/* Right - Info */}
        <div className={styles.rightColumn}>
          {/* Category */}
          <p className={styles.category}>{product.category}</p>

          {/* Title */}
          <h1 className={styles.title}>{product.title}</h1>

          {/* Rating */}
          <div className={styles.rating}>
            <div className={styles.stars}>
              {'★'.repeat(Math.floor(product.rating))}
              {'☆'.repeat(5 - Math.floor(product.rating))}
            </div>
            <span className={styles.ratingValue}>{product.rating}</span>
            <span className={styles.reviews}>({product.reviews} reseñas)</span>
          </div>

          {/* Price */}
          <div className={styles.price}>${product.price}</div>

          {/* Description */}
          <p className={styles.description}>{product.description}</p>

          {/* Specifications */}
          <div className={styles.specs}>
            <div className={styles.specItem}>
              <span className={styles.specLabel}>Dimensiones:</span>
              <span className={styles.specValue}>{product.dimensions}</span>
            </div>
            <div className={styles.specItem}>
              <span className={styles.specLabel}>Material:</span>
              <span className={styles.specValue}>{product.material}</span>
            </div>
            <div className={styles.specItem}>
              <span className={styles.specLabel}>Acabado:</span>
              <span className={styles.specValue}>{product.finish}</span>
            </div>
            <div className={styles.specItem}>
              <span className={styles.specLabel}>Producción:</span>
              <span className={styles.specValue}>{product.production}</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className={styles.actions}>
            <button className={styles.primaryButton}>Solicitar Cotización</button>
            <button className={styles.secondaryButton}>Agregar a Favoritos</button>
          </div>

          {/* Details */}
          <div className={styles.detailsSection}>
            <h3>Detalles del Diseño</h3>
            <div className={styles.detailsList}>
              {Object.entries(product.details).map(([key, value]) => (
                <div key={key} className={styles.detailItem}>
                  <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className={styles.related}>
        <h2>Otros Proyectos</h2>
        <div className={styles.relatedGrid}>
          {allProducts.filter(p => p.id !== parseInt(id)).slice(0, 4).map(p => (
            <Link key={p.id} to={`/producto/${p.id}`} className={styles.relatedCard}>
              <img src={p.image} alt={p.title} />
              <h4>{p.title}</h4>
              <p>{p.category}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
