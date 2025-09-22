# 🎛️ Panel de Administración - API REST

Panel de administración web completo para gestionar la API REST con interfaz gráfica moderna y responsiva.

## 🚀 Características

### ✨ **Interfaz Moderna**
- Diseño responsivo con Bootstrap 5
- Navegación lateral con iconos
- Animaciones y efectos visuales
- Tema con gradientes y sombras

### 📊 **Dashboard**
- Estadísticas en tiempo real
- Contadores de registros
- Vista general del sistema

### 🔧 **Gestión Completa CRUD**
- **Clientes**: Crear, listar, editar y eliminar
- **Productos**: Gestión completa de inventario
- **Cuentas**: Administración de cuentas bancarias
- **Movimientos**: Control de ingresos y egresos
- **Tipos de Movimiento**: Configuración de categorías
- **Frecuencias**: Gestión de periodicidades

### 🎯 **Funcionalidades**
- ✅ Validación de formularios en tiempo real
- ✅ Alertas y notificaciones
- ✅ Loading states durante las operaciones
- ✅ Confirmación antes de eliminar
- ✅ Manejo de errores completo
- ✅ Formularios modales dinámicos

## 📁 Archivos del Panel

```
api-mysql-rest-token/
├── panel.html          # Interfaz principal del panel
├── panel.js            # Lógica JavaScript y conexión API
├── sql/
│   ├── db_api_token_completo.sql      # BD con datos de prueba
│   └── estructura_base_datos.sql      # Solo estructura de BD
└── framework/
    ├── Controllers/    # Controladores de la API
    ├── Models/        # Modelos de datos
    └── Config/        # Configuración
```

## 🛠️ Instalación

### 1️⃣ **Configurar Base de Datos**
```sql
-- Opción A: Con datos de prueba
SOURCE sql/db_api_token_completo.sql

-- Opción B: Solo estructura
SOURCE sql/estructura_base_datos.sql
```

### 2️⃣ **Configurar Conexión**
Editar `framework/Config/Config.php`:
```php
const DB_HOST = "localhost";
const DB_NAME = "db_api_token";
const DB_USER = "root";
const DB_PASSWORD = "tu_contraseña";
```

### 3️⃣ **Configurar Servidor Web**
Asegurar que `.htaccess` esté configurado para URLs limpias.

### 4️⃣ **Acceder al Panel**
```
http://localhost/api-mysql-rest-token/panel.html
```

## 🎮 Uso del Panel

### **📋 Dashboard**
- Muestra estadísticas generales
- Contadores de registros por entidad
- Vista rápida del estado del sistema

### **👥 Gestión de Clientes**
- **Campos**: Identificación, nombres, apellidos, email, teléfono, dirección, NIT, datos fiscales
- **Validaciones**: Email único, identificación única
- **Operaciones**: Crear, ver, editar, eliminar

### **📦 Gestión de Productos**
- **Campos**: Código, nombre, descripción, precio
- **Validaciones**: Código único, precio numérico
- **Operaciones**: CRUD completo

### **🏦 Gestión de Cuentas**
- **Campos**: Nombre, número, tipo (Corriente/Ahorros/Crédito), banco, saldo
- **Validaciones**: Número único, tipos predefinidos
- **Operaciones**: CRUD completo

### **💰 Tipos de Movimiento**
- **Campos**: Nombre del movimiento, tipo (Ingreso/Egreso), descripción
- **Clasificación**: 1=Ingreso, 2=Egreso
- **Operaciones**: Crear, listar, editar

### **⏰ Frecuencias**
- **Campos**: Nombre, días, descripción
- **Uso**: Para programar movimientos recurrentes
- **Operaciones**: CRUD completo

## 🔌 Endpoints API Utilizados

### **Clientes**
```
GET    /cliente/clientes           # Listar todos
GET    /cliente/cliente/{id}       # Obtener uno
POST   /cliente/registro           # Crear nuevo
PUT    /cliente/actualizar/{id}    # Actualizar
DELETE /cliente/eliminar/{id}      # Eliminar
```

### **Productos**
```
GET    /producto/productos         # Listar todos
GET    /producto/producto/{id}     # Obtener uno
POST   /producto/registro          # Crear nuevo
PUT    /producto/actualizar/{id}   # Actualizar
DELETE /producto/eliminar/{id}     # Eliminar
```

### **Cuentas**
```
GET    /cuenta/cuentas            # Listar todas
GET    /cuenta/cuenta/{id}        # Obtener una
POST   /cuenta/registro           # Crear nueva
PUT    /cuenta/actualizar/{id}    # Actualizar
DELETE /cuenta/eliminar/{id}      # Eliminar
```

### **Tipos de Movimiento**
```
GET    /movimiento/tiposMovimiento           # Listar todos
POST   /movimiento/registroTipoMovimiento    # Crear nuevo
```

### **Frecuencias**
```
GET    /frecuencia/frecuencias     # Listar todas
POST   /frecuencia/registro        # Crear nueva
PUT    /frecuencia/actualizar/{id} # Actualizar
DELETE /frecuencia/eliminar/{id}   # Eliminar
```

## 🎨 Personalización

### **Colores y Tema**
Editar variables CSS en `panel.html`:
```css
:root {
    --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    --success-color: #28a745;
    --warning-color: #ffc107;
    --danger-color: #dc3545;
}
```

### **Configuración de API**
Editar en `panel.js`:
```javascript
const API_BASE_URL = 'http://localhost/api-mysql-rest-token';
```

## 🐛 Solución de Problemas

### **Error de Conexión API**
1. Verificar que Apache esté ejecutándose
2. Comprobar la URL en `API_BASE_URL`
3. Revisar configuración de base de datos

### **Tablas no Encontradas**
1. Ejecutar el archivo SQL de estructura
2. Verificar nombre de base de datos en Config.php

### **Errores de CORS**
Agregar headers en `.htaccess`:
```apache
Header always set Access-Control-Allow-Origin "*"
Header always set Access-Control-Allow-Methods "GET,POST,PUT,DELETE,OPTIONS"
Header always set Access-Control-Allow-Headers "Content-Type"
```

## 📱 Responsividad

El panel es completamente responsivo y funciona en:
- 💻 Desktop (1200px+)
- 💻 Laptop (992px - 1199px)
- 📱 Tablet (768px - 991px)
- 📱 Mobile (< 768px)

## 🔐 Seguridad

- Validación en frontend y backend
- Sanitización de datos con `strClean()`
- Validación de tipos de datos
- Confirmación antes de eliminar
- Manejo seguro de errores

---

**🎉 ¡Panel listo para usar! Accede a `panel.html` y comienza a gestionar tu API REST de forma visual.**