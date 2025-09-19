-- Active: 1758301867182@@127.0.0.1@3306@php-api
-- Crear la tabla tm_categoria
CREATE TABLE tm_categoria (
  cat_id INT AUTO_INCREMENT PRIMARY KEY,
  cat_nom VARCHAR(255) NOT NULL,
  cat_obs VARCHAR(255),
  est INT NOT NULL
);

-- Insertar 20 registros de ejemplo
INSERT INTO tm_categoria (cat_nom, cat_obs, est) VALUES
('Electrónica', 'Categoría de dispositivos electrónicos', 1),
('Ropa', 'Prendas de vestir', 1),
('Calzado', 'Zapatos y zapatillas', 1),
('Hogar', 'Artículos para el hogar', 1),
('Deportes', 'Material deportivo', 1),
('Libros', 'Libros y revistas', 1),
('Juguetes', 'Juguetes para niños', 1),
('Salud', 'Productos de salud', 1),
('Belleza', 'Cosméticos y belleza', 1),
('Automotriz', 'Repuestos y accesorios de autos', 1),
('Tecnología', 'Software y hardware', 1),
('Muebles', 'Muebles para el hogar', 1),
('Alimentos', 'Productos de alimentación', 1),
('Bebidas', 'Bebidas alcohólicas y no alcohólicas', 1),
('Papelería', 'Material de oficina y escolar', 1),
('Jardinería', 'Herramientas y plantas', 1),
('Mascotas', 'Productos para animales', 1),
('Instrumentos musicales', 'Instrumentos y accesorios musicales', 1),
('Videojuegos', 'Consolas y videojuegos', 1),
('Fotografía', 'Cámaras y accesorios', 1);


SELECT cat_id, cat_nom, cat_obs
FROM tm_categoria
WHERE est = 1;

