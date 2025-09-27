
# Tarea02 - Sistema de Autenticación y Gestión de Comunidad

Proyecto PHP con arquitectura MVC para gestionar usuarios, roles y sesiones en una comunidad.

## Estructura del proyecto

```
Tarea02/
├── app/
│   ├── Config/
│   │       └──conexion.php
│   ├── Controllers/
│   │       └── AuthController.php
│   │       └── AdminController.php
│   │       └── PresidenteController.php
│   │       └── VecinoController.php
│   ├── Models/
│   │       └── Vecino.php
│   │       └── VecinoRepository.php
│   └── Views/
│           ├── admin/
│           │     └── dashboardAdmin.php
│           ├── auth/
│           │     └── login.php
│           ├── layouts/
│           │     └── footer.php
│           │     └── header.php
│           │     └── navbar.php
│           ├── vecino/
│           │     └── dashboardVecino.php
│           └── presidente/
│                 └── dashboardPresidente.php
├── config/
│   └── routes.php
├── data/
│   └── vecinos.dat
├── public/
│   ├── css/
│   │   └── estilos.css
│   └── index.php
├── sql/
│   └── comunidad.sql
├── autoload.php
└── README.md

```


# Diagrama de Roles y Permisos
```
VecinosApp
├─ 🏠 Vecino
│   ├─ Ver solo sus datos
│   │   ├─ Nombre y Apellidos
│   │   ├─ DNI
│   │   ├─ Teléfono
│   │   ├─ Email
│   │   ├─ Vivienda(s)
│   │   ├─ Fecha de alta
│   │   ├─ Cuotas pagadas
│   │   ├─ Cuotas pendientes
│   │   └─ Fecha última cuota
│   └─ Acciones
│       ├─ Cambiar contraseña 🔑
│       └─ Cerrar sesión 🔒
│
├─ 👑 Presidente
│   ├─ Ver todos los datos de todos los vecinos
│   └─ Acciones
│       ├─ Modificar cuotas pagadas 💰
│       ├─ Modificar fecha última cuota 📅
│       └─ Cerrar sesión 🔒
│
└─ 🛠️ Administrador
    ├─ Ver todos los datos de todos los vecinos
    └─ Acciones
        ├─ Crear nuevo vecino ➕
        ├─ Modificar datos de vecino ✏️
        │   ├─ Teléfono
        │   ├─ Email
        │   ├─ Vivienda
        │   └─ Cuotas
        ├─ Eliminar vecino ❌
        └─ Cerrar sesión 🔒

```



# Dashboards según Rol

## 1️⃣ Dashboard del Vecino
```
- **Bienvenida:** "Bienvenido [Nombre Vecino]"  
- **Rol:** Vecino

**Datos visibles (solo lectura):**
- Nombre y Apellidos
- DNI
- Teléfono
- Email
- Vivienda(s)
- Fecha de alta
- Cuotas pagadas
- Cuotas pendientes
- Fecha última cuota

**Acciones permitidas:**
- Cambiar contraseña
- Cerrar sesión

---

```

## 2️⃣ Dashboard del Presidente

```
- **Bienvenida:** "Bienvenido [Nombre Presidente]"  
- **Rol:** Presidente

**Datos visibles de todos los vecinos:**
- Nombre y Apellidos
- DNI
- Teléfono
- Email
- Vivienda(s)
- Fecha de alta
- Cuotas pagadas (editable)
- Cuotas pendientes (calculadas automáticamente)
- Fecha última cuota (editable)

**Acciones permitidas:**
- Modificar cuotas pagadas y fecha última cuota
- Cerrar sesión

**Restricciones:**
- No puede dar de alta o baja vecinos
- No puede modificar teléfono, email ni vivienda

---
```
## 3️⃣ Dashboard del Administrador
```
- **Bienvenida:** "Bienvenido [Nombre Admin]"  
- **Rol:** Administrador

**Datos visibles y editables de todos los vecinos:**
- Nombre y Apellidos
- DNI
- Teléfono
- Email
- Vivienda(s)
- Fecha de alta
- Cuotas pagadas (editable)
- Cuotas pendientes (calculadas automáticamente)
- Fecha última cuota (editable)

**Acciones permitidas:**
- Crear, modificar y eliminar vecinos
- Cerrar sesión

**Consideraciones:**
- Campos obligatorios al crear un vecino: nombre, apellidos y DNI
- Cuotas pendientes se calculan automáticamente según la fecha de la última cuota

```

## Convenciones y patrones
- Autoloading propio en `autoload.php` (no composer).
- Controladores con sufijo `Controller`.
- Modelos en singular.
- Vistas organizadas por rol y recurso.
- Configuración de rutas en `config/routes.php`.
- Datos persistentes en archivos `.dat`.
- Punto de entrada único en `public/index.php`.

## Superglobales PHP utilizadas
Estas variables están disponibles en cualquier parte del código y son clave para el funcionamiento del sistema:

- `$_SERVER`: Información del servidor y entorno de ejecución.
- `$_GET`: Datos enviados por la URL (método GET).
- `$_POST`: Datos enviados por formulario (método POST).
- `$_FILES`: Archivos subidos por el usuario.
- `$_COOKIE`: Cookies enviadas por el navegador.
- `$_SESSION`: Variables de sesión del usuario.
- `$_REQUEST`: Combina `$_GET`, `$_POST` y `$_COOKIE`.
- `$_ENV`: Variables de entorno.
- `$_GLOBALS`: Todas las variables globales del script.

## Flujo principal
1. El usuario accede a `public/index.php`.
2. Se inicia la sesión y se cargan las dependencias.
3. Según el método y parámetros, se gestiona login, logout o dashboard según rol.
4. Los datos de usuarios y vecinos se leen desde archivos en `data/`.

## Permisos por rol

| Rol          | Ver                        | Modificar                                 | Acciones adicionales                  |
|--------------|----------------------------|-------------------------------------------|---------------------------------------|
| Vecino       | Sus datos                  | Solo su contraseña                        | Ninguna                               |
| Presidente   | Todos los vecinos          | Cuotas pagadas y fecha última cuota        | Ninguna                               |
| Administrador| Todos los vecinos          | Todos los datos (teléfono, email, viviendas, cuotas) | Alta/baja de vecinos                 |

## Scaffolding rápido
Para crear un nuevo recurso:
- Modelo: `app/Models/Recurso.php`
- Controlador: `app/Controllers/RecursoController.php`
- Vista: `app/Views/recurso/index.php`
- Añadir ruta en `config/routes.php` si es necesario.

---
Para dudas sobre superglobales, consulta la documentación oficial de PHP: https://www.php.net/manual/es/language.variables.superglobals.php
