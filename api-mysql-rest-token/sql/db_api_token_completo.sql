-- phpMyAdmin SQL Dump
-- Base de datos: `db_api_token`
-- Configuración completa de tablas para API REST
-- Fecha: 21 de septiembre de 2025

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `db_api_token`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cliente`
--

CREATE TABLE `cliente` (
  `idcliente` bigint(20) NOT NULL,
  `identificacion` varchar(20) COLLATE utf8mb4_spanish_ci NOT NULL,
  `nombres` varchar(100) COLLATE utf8mb4_spanish_ci NOT NULL,
  `apellidos` varchar(100) COLLATE utf8mb4_spanish_ci NOT NULL,
  `telefono` bigint(20) DEFAULT NULL,
  `email` varchar(150) COLLATE utf8mb4_spanish_ci NOT NULL,
  `direccion` text COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `nit` varchar(20) COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `nom_fiscal` varchar(200) COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `dir_fiscal` text COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `fecharegistro` datetime NOT NULL DEFAULT current_timestamp(),
  `status` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producto`
--

CREATE TABLE `producto` (
  `idproducto` bigint(20) NOT NULL,
  `codigo` varchar(50) COLLATE utf8mb4_spanish_ci NOT NULL,
  `nombre` varchar(150) COLLATE utf8mb4_spanish_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `precio` decimal(10,2) NOT NULL DEFAULT 0.00,
  `fecharegistro` datetime NOT NULL DEFAULT current_timestamp(),
  `status` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cuenta`
--

CREATE TABLE `cuenta` (
  `idcuenta` bigint(20) NOT NULL,
  `nombre_cuenta` varchar(150) COLLATE utf8mb4_spanish_ci NOT NULL,
  `numero_cuenta` varchar(50) COLLATE utf8mb4_spanish_ci NOT NULL,
  `tipo_cuenta` varchar(50) COLLATE utf8mb4_spanish_ci NOT NULL,
  `banco` varchar(100) COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `saldo` decimal(12,2) NOT NULL DEFAULT 0.00,
  `fecharegistro` datetime NOT NULL DEFAULT current_timestamp(),
  `status` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `frecuencia`
--

CREATE TABLE `frecuencia` (
  `idfrecuencia` bigint(20) NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_spanish_ci NOT NULL,
  `dias` int(11) NOT NULL,
  `descripcion` text COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `fecharegistro` datetime NOT NULL DEFAULT current_timestamp(),
  `status` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_movimiento`
--

CREATE TABLE `tipo_movimiento` (
  `idtipomovimiento` bigint(20) NOT NULL,
  `movimiento` varchar(100) COLLATE utf8mb4_spanish_ci NOT NULL,
  `tipo_movimiento` int(11) NOT NULL COMMENT '1=Ingreso, 2=Egreso',
  `descripcion` text COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `fecharegistro` datetime NOT NULL DEFAULT current_timestamp(),
  `status` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `movimiento`
--

CREATE TABLE `movimiento` (
  `idmovimiento` bigint(20) NOT NULL,
  `cuenta_id` bigint(20) NOT NULL,
  `tipo_movimiento_id` bigint(20) NOT NULL,
  `descripcion` text COLLATE utf8mb4_spanish_ci NOT NULL,
  `monto` decimal(10,2) NOT NULL,
  `fecha` date NOT NULL,
  `fecharegistro` datetime NOT NULL DEFAULT current_timestamp(),
  `status` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario` (tabla existente)
--

CREATE TABLE `usuario` (
  `idusuario` bigint(20) NOT NULL,
  `nombre` varchar(255) COLLATE utf8mb4_spanish_ci NOT NULL,
  `telefono` bigint(20) DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_spanish_ci NOT NULL,
  `direccion` text COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `fecharegistro` datetime NOT NULL DEFAULT current_timestamp(),
  `status` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Datos de prueba para la tabla `cliente`
--

INSERT INTO `cliente` (`idcliente`, `identificacion`, `nombres`, `apellidos`, `telefono`, `email`, `direccion`, `nit`, `nom_fiscal`, `dir_fiscal`, `fecharegistro`, `status`) VALUES
(1, '12345678', 'Juan Carlos', 'Pérez García', 50123456, 'juan.perez@email.com', 'Zona 1, Ciudad de Guatemala', '123456-7', 'Juan Carlos Pérez García', 'Zona 1, Ciudad de Guatemala', NOW(), 1),
(2, '87654321', 'María José', 'López Martínez', 50987654, 'maria.lopez@email.com', 'Zona 10, Guatemala', '987654-3', 'María José López Martínez', 'Zona 10, Guatemala', NOW(), 1);

--
-- Datos de prueba para la tabla `producto`
--

INSERT INTO `producto` (`idproducto`, `codigo`, `nombre`, `descripcion`, `precio`, `fecharegistro`, `status`) VALUES
(1, 'PROD001', 'Laptop HP', 'Laptop HP Pavilion 15 pulgadas', 8500.00, NOW(), 1),
(2, 'PROD002', 'Mouse Logitech', 'Mouse inalámbrico Logitech', 250.00, NOW(), 1),
(3, 'PROD003', 'Teclado Mecánico', 'Teclado mecánico retroiluminado', 450.00, NOW(), 1);

--
-- Datos de prueba para la tabla `cuenta`
--

INSERT INTO `cuenta` (`idcuenta`, `nombre_cuenta`, `numero_cuenta`, `tipo_cuenta`, `banco`, `saldo`, `fecharegistro`, `status`) VALUES
(1, 'Cuenta Corriente Principal', '1234567890', 'Corriente', 'Banco Industrial', 15000.00, NOW(), 1),
(2, 'Cuenta de Ahorros', '0987654321', 'Ahorros', 'Banco G&T', 5000.00, NOW(), 1);

--
-- Datos de prueba para la tabla `frecuencia`
--

INSERT INTO `frecuencia` (`idfrecuencia`, `nombre`, `dias`, `descripcion`, `fecharegistro`, `status`) VALUES
(1, 'Diario', 1, 'Frecuencia diaria', NOW(), 1),
(2, 'Semanal', 7, 'Frecuencia semanal', NOW(), 1),
(3, 'Quincenal', 15, 'Frecuencia quincenal', NOW(), 1),
(4, 'Mensual', 30, 'Frecuencia mensual', NOW(), 1);

--
-- Datos de prueba para la tabla `tipo_movimiento`
--

INSERT INTO `tipo_movimiento` (`idtipomovimiento`, `movimiento`, `tipo_movimiento`, `descripcion`, `fecharegistro`, `status`) VALUES
(1, 'Venta de Producto', 1, 'Ingreso por venta de productos', NOW(), 1),
(2, 'Pago de Servicios', 2, 'Egreso por pago de servicios básicos', NOW(), 1),
(3, 'Comisión Bancaria', 2, 'Egreso por comisiones bancarias', NOW(), 1),
(4, 'Depósito', 1, 'Ingreso por depósito', NOW(), 1);

--
-- Datos de prueba para la tabla `movimiento`
--

INSERT INTO `movimiento` (`idmovimiento`, `cuenta_id`, `tipo_movimiento_id`, `descripcion`, `monto`, `fecha`, `fecharegistro`, `status`) VALUES
(1, 1, 1, 'Venta de laptop HP', 8500.00, '2025-09-21', NOW(), 1),
(2, 1, 2, 'Pago de electricidad', 350.00, '2025-09-20', NOW(), 1),
(3, 2, 4, 'Depósito inicial', 5000.00, '2025-09-19', NOW(), 1);

--
-- Datos de prueba para la tabla `usuario` (existente)
--

INSERT INTO `usuario` (`idusuario`, `nombre`, `telefono`, `email`, `direccion`, `fecharegistro`, `status`) VALUES
(1, 'Abel OSH', NULL, 'info@abelosh.com', NULL, '2022-09-03 23:27:37', 1),
(2, 'Admin Sistema', 50123456, 'admin@sistema.com', 'Guatemala', NOW(), 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `cliente`
--
ALTER TABLE `cliente`
  ADD PRIMARY KEY (`idcliente`),
  ADD UNIQUE KEY `identificacion` (`identificacion`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indices de la tabla `producto`
--
ALTER TABLE `producto`
  ADD PRIMARY KEY (`idproducto`),
  ADD UNIQUE KEY `codigo` (`codigo`);

--
-- Indices de la tabla `cuenta`
--
ALTER TABLE `cuenta`
  ADD PRIMARY KEY (`idcuenta`),
  ADD UNIQUE KEY `numero_cuenta` (`numero_cuenta`);

--
-- Indices de la tabla `frecuencia`
--
ALTER TABLE `frecuencia`
  ADD PRIMARY KEY (`idfrecuencia`);

--
-- Indices de la tabla `tipo_movimiento`
--
ALTER TABLE `tipo_movimiento`
  ADD PRIMARY KEY (`idtipomovimiento`);

--
-- Indices de la tabla `movimiento`
--
ALTER TABLE `movimiento`
  ADD PRIMARY KEY (`idmovimiento`),
  ADD KEY `fk_movimiento_cuenta` (`cuenta_id`),
  ADD KEY `fk_movimiento_tipo` (`tipo_movimiento_id`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`idusuario`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `cliente`
--
ALTER TABLE `cliente`
  MODIFY `idcliente` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `producto`
--
ALTER TABLE `producto`
  MODIFY `idproducto` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `cuenta`
--
ALTER TABLE `cuenta`
  MODIFY `idcuenta` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `frecuencia`
--
ALTER TABLE `frecuencia`
  MODIFY `idfrecuencia` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `tipo_movimiento`
--
ALTER TABLE `tipo_movimiento`
  MODIFY `idtipomovimiento` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `movimiento`
--
ALTER TABLE `movimiento`
  MODIFY `idmovimiento` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `idusuario` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `movimiento`
--
ALTER TABLE `movimiento`
  ADD CONSTRAINT `fk_movimiento_cuenta` FOREIGN KEY (`cuenta_id`) REFERENCES `cuenta` (`idcuenta`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_movimiento_tipo` FOREIGN KEY (`tipo_movimiento_id`) REFERENCES `tipo_movimiento` (`idtipomovimiento`) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;