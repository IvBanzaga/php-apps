-- =====================================================
-- SCRIPT DE DATOS DE PRUEBA PARA API MYSQL REST TOKEN
-- =====================================================
-- Fecha: 22 de septiembre de 2025
-- Descripción: Datos de ejemplo para todas las tablas del sistema
-- Instrucciones: Ejecutar este script en phpMyAdmin o tu cliente MySQL preferido

-- =====================================================
-- 1. TABLA CLIENTE
-- =====================================================
INSERT INTO cliente (idcliente, identificacion, nombres, apellidos, telefono, email, direccion, nit, nom_fiscal, dir_fiscal, fecharegistro, status) VALUES
(1, '12345678', 'Juan Carlos', 'Pérez Rodríguez', 3001234567, 'juan.perez@email.com', 'Calle 123 #45-67', '900123456-1', 'Juan Carlos Pérez', 'Calle 123 #45-67', NOW(), 1),
(2, '87654321', 'María Elena', 'García López', 3007654321, 'maria.garcia@email.com', 'Carrera 45 #12-34', '900654321-2', 'María Elena García', 'Carrera 45 #12-34', NOW(), 1),
(3, '11223344', 'Carlos Alberto', 'Martínez Silva', 3009876543, 'carlos.martinez@email.com', 'Avenida 78 #90-12', '900332211-3', 'Carlos Alberto Martínez', 'Avenida 78 #90-12', NOW(), 1),
(4, '44332211', 'Ana Patricia', 'López Hernández', 3001122334, 'ana.lopez@email.com', 'Calle 56 #78-90', '900998877-4', 'Ana Patricia López', 'Calle 56 #78-90', NOW(), 1),
(5, '55667788', 'Roberto', 'Sánchez Morales', 3005566778, 'roberto.sanchez@email.com', 'Carrera 12 #34-56', '900556677-5', 'Roberto Sánchez', 'Carrera 12 #34-56', NOW(), 1),
(6, '99887766', 'Carmen Teresa', 'Jiménez Castro', 3009988776, 'carmen.jimenez@email.com', 'Avenida 23 #45-67', '900887799-6', 'Carmen Teresa Jiménez', 'Avenida 23 #45-67', NOW(), 1),
(7, '13579246', 'Luis Fernando', 'Ramírez Vega', 3001357924, 'luis.ramirez@email.com', 'Calle 89 #12-34', '900135792-7', 'Luis Fernando Ramírez', 'Calle 89 #12-34', NOW(), 1),
(8, '24681357', 'Patricia', 'Moreno Díaz', 3002468135, 'patricia.moreno@email.com', 'Carrera 67 #89-01', '900246813-8', 'Patricia Moreno', 'Carrera 67 #89-01', NOW(), 1),
(9, '98765432', 'Andrés Felipe', 'Torres Ruiz', 3009876543, 'andres.torres@email.com', 'Avenida 45 #67-89', '900987654-9', 'Andrés Felipe Torres', 'Avenida 45 #67-89', NOW(), 1),
(10, '11111111', 'Isabel', 'Vargas Mendoza', 3001111111, 'isabel.vargas@email.com', 'Calle 11 #11-11', '900111111-0', 'Isabel Vargas', 'Calle 11 #11-11', NOW(), 1);

-- =====================================================
-- 2. TABLA TIPO_MOVIMIENTO
-- =====================================================
INSERT INTO tipo_movimiento (idtipomovimiento, movimiento, tipo_movimiento, descripcion, fecharegistro, status) VALUES
(1, 'Depósito', 1, 'Ingreso de dinero a la cuenta', NOW(), 1),
(2, 'Transferencia Recibida', 1, 'Dinero recibido por transferencia', NOW(), 1),
(3, 'Pago de Nómina', 1, 'Ingreso por concepto de salario', NOW(), 1),
(4, 'Venta', 1, 'Ingreso por venta de productos o servicios', NOW(), 1),
(5, 'Retiro', 2, 'Retiro de dinero en efectivo', NOW(), 1),
(6, 'Transferencia Enviada', 2, 'Dinero enviado por transferencia', NOW(), 1),
(7, 'Pago de Servicios', 2, 'Pago de servicios públicos o privados', NOW(), 1),
(8, 'Compra', 2, 'Pago por compra de productos', NOW(), 1),
(9, 'Comisión Bancaria', 2, 'Cobro de comisiones por servicios bancarios', NOW(), 1),
(10, 'Pago de Préstamo', 2, 'Pago de cuotas de préstamos', NOW(), 1);

-- =====================================================
-- 3. TABLA FRECUENCIA
-- =====================================================
INSERT INTO frecuencia (idfrecuencia, nombre, dias, descripcion, fecharegistro, status) VALUES
(1, 'Diario', 1, 'Movimientos que se realizan todos los días', NOW(), 1),
(2, 'Semanal', 7, 'Movimientos que se realizan cada semana', NOW(), 1),
(3, 'Quincenal', 15, 'Movimientos que se realizan cada quince días', NOW(), 1),
(4, 'Mensual', 30, 'Movimientos que se realizan cada mes', NOW(), 1),
(5, 'Bimestral', 60, 'Movimientos que se realizan cada dos meses', NOW(), 1),
(6, 'Trimestral', 90, 'Movimientos que se realizan cada tres meses', NOW(), 1),
(7, 'Semestral', 180, 'Movimientos que se realizan cada seis meses', NOW(), 1),
(8, 'Anual', 365, 'Movimientos que se realizan cada año', NOW(), 1);

-- =====================================================
-- 4. TABLA PRODUCTO
-- =====================================================
INSERT INTO producto (idproducto, codigo, nombre, descripcion, precio, fecharegistro, status) VALUES
(1, 'PROD001', 'Cuenta de Ahorros Básica', 'Cuenta de ahorros sin cuota de manejo', 0.00, NOW(), 1),
(2, 'PROD002', 'Cuenta de Ahorros Premium', 'Cuenta de ahorros con beneficios adicionales', 15000.00, NOW(), 1),
(3, 'PROD003', 'Cuenta Corriente', 'Cuenta corriente para manejo empresarial', 25000.00, NOW(), 1),
(4, 'PROD004', 'CDT 90 días', 'Certificado de Depósito a Término 90 días', 500000.00, NOW(), 1),
(5, 'PROD005', 'CDT 180 días', 'Certificado de Depósito a Término 180 días', 1000000.00, NOW(), 1),
(6, 'PROD006', 'CDT 360 días', 'Certificado de Depósito a Término 360 días', 2000000.00, NOW(), 1),
(7, 'PROD007', 'Préstamo Personal', 'Préstamo personal sin garantía', 250000.00, NOW(), 1),
(8, 'PROD008', 'Préstamo Hipotecario', 'Préstamo para compra de vivienda', 5000000.00, NOW(), 1);

-- =====================================================
-- 5. TABLA CUENTA
-- =====================================================
INSERT INTO cuenta (idcuenta, nombre_cuenta, numero_cuenta, tipo_cuenta, banco, saldo, fecharegistro, status) VALUES
(1, 'Cuenta Ahorros Juan Pérez', '1234567890', 'Ahorros', 'Banco Nacional', 1500000.00, NOW(), 1),
(2, 'Cuenta Corriente García', '2345678901', 'Corriente', 'Banco Popular', 2800000.00, NOW(), 1),
(3, 'Ahorros Martínez', '3456789012', 'Ahorros', 'Bancolombia', 950000.00, NOW(), 1),
(4, 'Cuenta Empresarial López', '4567890123', 'Corriente', 'Banco de Bogotá', 5200000.00, NOW(), 1),
(5, 'Ahorros Roberto Sánchez', '5678901234', 'Ahorros', 'Banco Nacional', 780000.00, NOW(), 1),
(6, 'Cuenta Premium Carmen', '6789012345', 'Ahorros', 'Banco Popular', 3400000.00, NOW(), 1),
(7, 'Corriente Luis Ramírez', '7890123456', 'Corriente', 'Bancolombia', 1950000.00, NOW(), 1),
(8, 'Ahorros Patricia Moreno', '8901234567', 'Ahorros', 'Banco de Bogotá', 1200000.00, NOW(), 1),
(9, 'Cuenta Andrés Torres', '9012345678', 'Ahorros', 'Banco Nacional', 2150000.00, NOW(), 1),
(10, 'Ahorros Isabel Vargas', '0123456789', 'Ahorros', 'Banco Popular', 890000.00, NOW(), 1);

-- =====================================================
-- 6. TABLA MOVIMIENTO
-- =====================================================
INSERT INTO movimiento (idmovimiento, cuenta_id, tipo_movimiento_id, descripcion, monto, fecha, fecharegistro, status) VALUES
-- Movimientos para cuenta 1 (Juan Pérez)
(1, 1, 1, 'Depósito inicial cuenta de ahorros', 1000000.00, '2025-09-01', NOW(), 1),
(2, 1, 1, 'Transferencia recibida de nómina', 2500000.00, '2025-09-15', NOW(), 1),
(3, 1, 5, 'Retiro en cajero automático', 300000.00, '2025-09-16', NOW(), 1),
(4, 1, 7, 'Pago de servicios públicos', 150000.00, '2025-09-20', NOW(), 1),

-- Movimientos para cuenta 2 (María García)
(5, 2, 1, 'Depósito empresarial', 5000000.00, '2025-09-01', NOW(), 1),
(6, 2, 4, 'Venta de servicios', 1200000.00, '2025-09-10', NOW(), 1),
(7, 2, 8, 'Compra de suministros', 800000.00, '2025-09-12', NOW(), 1),
(8, 2, 6, 'Transferencia a proveedores', 1600000.00, '2025-09-18', NOW(), 1),

-- Movimientos para cuenta 3 (Carlos Martínez)
(9, 3, 1, 'Consignación inicial', 800000.00, '2025-09-02', NOW(), 1),
(10, 3, 3, 'Pago de nómina', 1800000.00, '2025-09-15', NOW(), 1),
(11, 3, 5, 'Retiro para gastos personales', 250000.00, '2025-09-17', NOW(), 1),

-- Movimientos para cuenta 4 (Ana López)
(12, 4, 1, 'Depósito empresarial grande', 8000000.00, '2025-09-01', NOW(), 1),
(13, 4, 4, 'Venta de productos', 2500000.00, '2025-09-08', NOW(), 1),
(14, 4, 8, 'Compra de mercancía', 1800000.00, '2025-09-10', NOW(), 1),
(15, 4, 6, 'Pago a empleados', 3500000.00, '2025-09-15', NOW(), 1),

-- Movimientos para cuenta 5 (Roberto Sánchez)
(16, 5, 1, 'Depósito de ahorros', 600000.00, '2025-09-03', NOW(), 1),
(17, 5, 2, 'Transferencia familiar', 400000.00, '2025-09-12', NOW(), 1),
(18, 5, 7, 'Pago de tarjeta de crédito', 220000.00, '2025-09-19', NOW(), 1),

-- Movimientos para cuenta 6 (Carmen Jiménez)
(19, 6, 1, 'Depósito premium', 3000000.00, '2025-09-01', NOW(), 1),
(20, 6, 3, 'Bonificación especial', 800000.00, '2025-09-15', NOW(), 1),
(21, 6, 8, 'Compra de inversiones', 400000.00, '2025-09-21', NOW(), 1),

-- Movimientos para cuenta 7 (Luis Ramírez)
(22, 7, 1, 'Apertura cuenta corriente', 2000000.00, '2025-09-04', NOW(), 1),
(23, 7, 4, 'Ingresos por ventas', 950000.00, '2025-09-14', NOW(), 1),
(24, 7, 6, 'Transferencia comercial', 1000000.00, '2025-09-20', NOW(), 1),

-- Movimientos para cuenta 8 (Patricia Moreno)
(25, 8, 1, 'Consignación inicial', 1000000.00, '2025-09-05', NOW(), 1),
(26, 8, 2, 'Transferencia recibida', 500000.00, '2025-09-16', NOW(), 1),
(27, 8, 5, 'Retiro para emergencia', 300000.00, '2025-09-22', NOW(), 1),

-- Movimientos para cuenta 9 (Andrés Torres)
(28, 9, 1, 'Depósito profesional', 2000000.00, '2025-09-01', NOW(), 1),
(29, 9, 3, 'Pago de honorarios', 1500000.00, '2025-09-15', NOW(), 1),
(30, 9, 7, 'Pago de seguros', 350000.00, '2025-09-18', NOW(), 1),

-- Movimientos para cuenta 10 (Isabel Vargas)
(31, 10, 1, 'Apertura cuenta de ahorros', 700000.00, '2025-09-06', NOW(), 1),
(32, 10, 2, 'Transferencia familiar', 300000.00, '2025-09-17', NOW(), 1),
(33, 10, 5, 'Retiro para gastos', 110000.00, '2025-09-21', NOW(), 1);

-- =====================================================
-- 7. TABLA USUARIO  
-- =====================================================
INSERT INTO usuario (idusuario, nombre, telefono, email, direccion, fecharegistro, status) VALUES
(1, 'Administrador Principal', 3001000000, 'admin@apirest.com', 'Oficina Central', NOW(), 1),
(2, 'María Supervisor', 3001111111, 'maria.supervisor@apirest.com', 'Sucursal Norte', NOW(), 1),
(3, 'Carlos Operador', 3002222222, 'carlos.operador@apirest.com', 'Sucursal Sur', NOW(), 1),
(4, 'Ana Asistente', 3003333333, 'ana.asistente@apirest.com', 'Sucursal Centro', NOW(), 1),
(5, 'Roberto Auditor', 3004444444, 'roberto.auditor@apirest.com', 'Oficina Auditoría', NOW(), 1);

-- =====================================================
-- CONSULTAS DE VERIFICACIÓN (OPCIONAL)
-- =====================================================
-- Descomenta estas líneas para verificar que los datos se insertaron correctamente

-- SELECT COUNT(*) as total_clientes FROM cliente WHERE status = 1;
-- SELECT COUNT(*) as total_cuentas FROM cuenta WHERE status = 1;
-- SELECT COUNT(*) as total_productos FROM producto WHERE status = 1;
-- SELECT COUNT(*) as total_movimientos FROM movimiento WHERE status = 1;
-- SELECT COUNT(*) as total_tipos_movimiento FROM tipo_movimiento WHERE status = 1;
-- SELECT COUNT(*) as total_frecuencias FROM frecuencia WHERE status = 1;
-- SELECT COUNT(*) as total_usuarios FROM usuario WHERE status = 1;

-- =====================================================
-- RESUMEN DE DATOS INSERTADOS
-- =====================================================
-- ✅ 10 Clientes con información completa
-- ✅ 10 Tipos de movimiento (ingresos y egresos)
-- ✅ 8 Frecuencias (diario a anual)
-- ✅ 10 Productos financieros
-- ✅ 10 Cuentas bancarias con saldos
-- ✅ 33 Movimientos distribuidos entre las cuentas
-- ✅ 5 Usuarios del sistema

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================