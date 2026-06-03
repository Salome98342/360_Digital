-- ==========================================
-- TABLA ADMINISTRADOR
-- ==========================================
CREATE TABLE administrador (
    id_admin SERIAL PRIMARY KEY,
    usuario VARCHAR(50) NOT NULL UNIQUE,
    correo VARCHAR(100) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- TABLA SERVICIO (NUEVO - Para homepage)
-- ==========================================
CREATE TABLE servicio (
    id_servicio SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    imagen TEXT,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- TABLA CATEGORIA PRODUCTO
-- ==========================================
CREATE TABLE categoria_producto (
    id_categoria SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT
);

-- ==========================================
-- TABLA PRODUCTO
-- ==========================================
CREATE TABLE producto (
    id_producto SERIAL PRIMARY KEY,
    id_categoria INTEGER NOT NULL,
    id_admin INTEGER NOT NULL,
    
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    precio NUMERIC(10,2) NOT NULL,
    
    -- Especificaciones en JSON (flexible)
    especificaciones JSONB,
    
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_producto_categoria
        FOREIGN KEY (id_categoria)
        REFERENCES categoria_producto(id_categoria),
    
    CONSTRAINT fk_producto_admin
        FOREIGN KEY (id_admin)
        REFERENCES administrador(id_admin)
);

-- ==========================================
-- TABLA GALERIA PRODUCTO
-- ==========================================
CREATE TABLE galeria_producto (
    id_imagen SERIAL PRIMARY KEY,
    id_producto INTEGER NOT NULL,
    
    url_imagen TEXT NOT NULL,
    descripcion VARCHAR(255),
    
    CONSTRAINT fk_galeria_producto
        FOREIGN KEY (id_producto)
        REFERENCES producto(id_producto)
        ON DELETE CASCADE
);

-- ==========================================
-- TABLA RESEÑA
-- ==========================================
CREATE TABLE resena (
    id_resena SERIAL PRIMARY KEY,
    id_producto INTEGER NOT NULL,
    
    nombre_cliente VARCHAR(100) NOT NULL,
    puntuacion INTEGER NOT NULL
        CHECK (puntuacion BETWEEN 1 AND 5),
    comentario TEXT,
    
    fecha_resena TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_resena_producto
        FOREIGN KEY (id_producto)
        REFERENCES producto(id_producto)
        ON DELETE CASCADE
);

-- ==========================================
-- TABLA FORMULARIO CONTACTO
-- ==========================================
CREATE TABLE formulario_contacto (
    id_formulario SERIAL PRIMARY KEY,
    
    nombre_completo VARCHAR(150) NOT NULL,
    correo VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    mensaje TEXT NOT NULL,
    
    fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);