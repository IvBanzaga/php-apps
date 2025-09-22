# API MySQL REST Token

## Descripción del Proyecto
Este proyecto es una API REST desarrollada en PHP que utiliza MySQL como base de datos. Proporciona endpoints para gestionar clientes, productos, cuentas, movimientos y frecuencias. Está diseñada para ser utilizada como backend para un panel de administración o cualquier aplicación que requiera estas funcionalidades.

## Estructura del Proyecto
La estructura del proyecto es la siguiente:

```
framework/
├── Autoload.php
├── index.php
├── panel.html
├── panel.js
├── style.css
├── Assets/
├── Config/
│   └── Config.php
├── Controllers/
│   ├── Api.php
│   ├── Cliente.php
│   ├── Cuenta.php
│   ├── Error.php
│   ├── Frecuencia.php
│   ├── Home.php
│   ├── Movimiento.php
│   ├── Producto.php
│   └── Test.php
├── Helpers/
│   └── Helpers.php
├── Libraries/
│   ├── Core/
│   │   ├── Conexion.php
│   │   ├── Controllers.php
│   │   ├── Load.php
│   │   ├── Mysql.php
│   │   └── Views.php
├── Models/
│   ├── ApiModel.php
│   ├── ClienteModel.php
│   ├── CuentaModel.php
│   ├── FrecuenciaModel.php
│   ├── HomeModel.php
│   ├── MovimientoModel.php
│   ├── ProductoModel.php
│   └── TestModel.php
├── Views/
│   ├── Home.php
│   └── Errors/
│       └── error.php
└── datos_prueba.sql
```

## Configuración del Proyecto

### Requisitos
- Servidor Apache con PHP 7.4 o superior.
- MySQL 5.7 o superior.
- Cliente REST para probar los endpoints (Postman, cURL, etc.).

### Instalación
1. Clona este repositorio en tu servidor local.
2. Configura el archivo `Config/Config.php` con los datos de conexión a tu base de datos.
3. Importa el archivo `datos_prueba.sql` en tu base de datos MySQL.
4. Asegúrate de que el servidor Apache esté configurado para servir este proyecto.

### Ejecución
Accede al proyecto desde tu navegador en la URL: `http://localhost/api-mysql-rest-token/framework/panel.html`.

## Endpoints Disponibles

### Cliente
- **GET** `/cliente/clientes`: Obtiene todos los clientes.
- **GET** `/cliente/{id}`: Obtiene un cliente por ID.
- **POST** `/cliente`: Crea un nuevo cliente.
- **PUT** `/cliente/{id}`: Actualiza un cliente existente.
- **DELETE** `/cliente/{id}`: Elimina un cliente.

### Cuenta
- **GET** `/cuenta/cuentas`: Obtiene todas las cuentas.
- **GET** `/cuenta/{id}`: Obtiene una cuenta por ID.
- **POST** `/cuenta`: Crea una nueva cuenta.
- **PUT** `/cuenta/{id}`: Actualiza una cuenta existente.
- **DELETE** `/cuenta/{id}`: Elimina una cuenta.

### Frecuencia
- **GET** `/frecuencia/frecuencias`: Obtiene todas las frecuencias.
- **GET** `/frecuencia/{id}`: Obtiene una frecuencia por ID.
- **POST** `/frecuencia`: Crea una nueva frecuencia.
- **PUT** `/frecuencia/{id}`: Actualiza una frecuencia existente.
- **DELETE** `/frecuencia/{id}`: Elimina una frecuencia.

## Cambios Recientes
- **22 de septiembre de 2025**: Se añadieron métodos para gestionar movimientos en `CuentaModel.php` y `Cuenta.php`.
- Se corrigieron errores en `panel.js` relacionados con la carga de datos de las cuentas y movimientos.
- Se verificó la funcionalidad de los endpoints de `frecuencia`.

## Conectividad
El proyecto utiliza la clase `Mysql` para gestionar la conexión a la base de datos. Asegúrate de que los datos de conexión en `Config/Config.php` sean correctos.

## Uso
1. Abre el archivo `panel.html` en tu navegador.
2. Navega entre las secciones para gestionar clientes, productos, cuentas, movimientos y frecuencias.
3. Utiliza herramientas como Postman para probar los endpoints directamente.

## Contribuciones
Si deseas contribuir a este proyecto, por favor crea un fork y envía tus cambios mediante un pull request.

## Licencia
Este proyecto está bajo la licencia MIT.