-- Crear base de datos
CREATE DATABASE IF NOT EXISTS comunidad;
USE comunidad;

-- Tabla de usuarios (vecinos, presidente, administrador)
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    dni VARCHAR(15) NOT NULL UNIQUE,
    telefono VARCHAR(20),
    email VARCHAR(100),
    password VARCHAR(255) NOT NULL,
    rol ENUM('vecino', 'presidente', 'administrador') NOT NULL,
    fecha_alta DATE NOT NULL,
    activo TINYINT(1) DEFAULT 1
);

-- Tabla de viviendas
CREATE TABLE viviendas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bloque VARCHAR(10) NOT NULL,
    piso VARCHAR(10) NOT NULL,
    letra CHAR(1) NOT NULL,
    UNIQUE (bloque, piso, letra)
);

-- Relación vecinos-viviendas (un vecino puede tener varias viviendas)
CREATE TABLE vecinos_viviendas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    vivienda_id INT NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (vivienda_id) REFERENCES viviendas(id),
    UNIQUE (usuario_id, vivienda_id)
);

-- Tabla de cuotas
CREATE TABLE cuotas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    vivienda_id INT NOT NULL,
    fecha_pago DATE NOT NULL,
    pagada TINYINT(1) NOT NULL DEFAULT 1,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (vivienda_id) REFERENCES viviendas(id)
);

-- Tabla para registrar cuotas pendientes 
CREATE TABLE cuotas_pendientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    vivienda_id INT NOT NULL,
    fecha_cuota DATE NOT NULL,
    pagada TINYINT(1) NOT NULL DEFAULT 0,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (vivienda_id) REFERENCES viviendas(id)
);

-- Inserción de roles
-- El administrador puede no ser vecino, así que puede tener vivienda_id NULL
INSERT INTO usuarios (nombre, apellidos, dni, telefono, email, password, rol, fecha_alta)
VALUES ('Admin', 'Gestoria', '00000000A', NULL, 'admin@comunidad.com', 'adminpass', 'administrador', CURDATE());

-- El presidente es un vecino, así que puede tener rol 'presidente' y estar en vecinos_viviendas
-- Inserción de vivienda y vecino
INSERT INTO viviendas (bloque, piso, letra) VALUES ('A', '1', 'B');
INSERT INTO usuarios (nombre, apellidos, dni, telefono, email, password, rol, fecha_alta)
VALUES ('Juan', 'Pérez', '12345678Z', '600123456', 'juan@vecino.com', 'juanpass', 'presidente', CURDATE());
INSERT INTO vecinos_viviendas (usuario_id, vivienda_id) VALUES (2, 1);

-- Vecino normal
INSERT INTO viviendas (bloque, piso, letra) VALUES ('B', '2', 'C');
INSERT INTO usuarios (nombre, apellidos, dni, telefono, email, password, rol, fecha_alta)
VALUES ('Ana', 'García', '87654321X', '600654321', 'ana@vecino.com', 'anapass', 'vecino', CURDATE());
INSERT INTO vecinos_viviendas (usuario_id, vivienda_id) VALUES (3, 2);

-- Cuota pagada y pendiente para el vecino
INSERT INTO cuotas (usuario_id, vivienda_id, fecha_pago, pagada) VALUES (3, 2, '2025-08-01', 1);
INSERT INTO cuotas_pendientes (usuario_id, vivienda_id, fecha_cuota, pagada) VALUES (3, 2, '2025-09-01', 0);

-- Cuota pagada
INSERT INTO cuotas (usuario_id, vivienda_id, fecha_pago, pagada) VALUES (2, 1, '2025-09-01', 1);

-- Cuota pendiente
INSERT INTO cuotas_pendientes (usuario_id, vivienda_id, fecha_cuota, pagada) VALUES (2, 1, '2025-10-01', 0);