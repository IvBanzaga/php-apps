CREATE DATABASE IF NOT EXISTS negociophp;
USE negociophp;

-- Tabla de clientes
CREATE TABLE cliente (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_usuario VARCHAR(50) NOT NULL,
    passw_usuario VARCHAR(50) NOT NULL
);

-- Tabla de países
CREATE TABLE pais (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_pais VARCHAR(50) NOT NULL
);

-- Relación cliente-pais (opcional, si quieres vincular clientes y países)
CREATE TABLE pais_cliente (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT NOT NULL,
    id_pais INT NOT NULL,
    FOREIGN KEY (id_cliente) REFERENCES cliente(id),
    FOREIGN KEY (id_pais) REFERENCES pais(id)
);

-- Tabla de artículos (para la búsqueda)
CREATE TABLE articulo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2)
);

-- Datos de ejemplo para cliente
INSERT INTO cliente (nombre_usuario, passw_usuario) VALUES
('ivan', '1234'),
('maria', '1234'),
('pedro', '1234');

-- Datos de ejemplo para pais
INSERT INTO pais (nombre_pais) VALUES
('España'),
('México'),
('Argentina');

-- Relación cliente-pais
INSERT INTO pais_cliente (id_cliente, id_pais) VALUES
(1, 1), -- Juan - España
(2, 2), -- Maria - México
(3, 3); -- Pedro - Argentina

-- Datos de ejemplo para articulo
INSERT INTO articulo (nombre, descripcion, precio) VALUES
('Laptop', 'Portátil de 15 pulgadas', 750.00),
('Mouse', 'Ratón óptico USB', 15.50),
('Teclado', 'Teclado mecánico', 45.00),
('Monitor', 'Monitor LED 24"', 120.00);