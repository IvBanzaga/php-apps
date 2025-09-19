[[Wifi]]
# Instalación y Configuración de Apache, MariaDB y PHP en Windows (sin XAMPP)

## Índice

1. [Apache](#apache)
2. [MariaDB](#mariadb)
3. [PHP](#php)
4. [VirtualHost](#virtualhost)
5. [Configurar e instalación de PhpMyAdmin](#configurar-e-instalacion-de-phpmyadmin)
6. [Configurar Apache](#configurar-apache)
7. [Iniciar Apache en modo automático](#iniciar-apache-en-modo-automatico)
8. [Iniciar MariaDB en modo automático](#iniciar-mariadb-en-modo-automatico)
9. [Script en PowerShell que reinicia](#script-en-powershell-que-reinicia)
10. [Recursos y Documentación Oficial](#recursos)


### Enlaces rápidos (rutas locales)

| Archivo / Propósito | Ruta local |
|---|---|
| httpd.conf (Apache) | [C:\Apache24\conf](file:///C:/Apache24/conf) |
| httpd-vhosts.conf (VirtualHosts) | [C:\Apache24\conf\extra](file:///C:/Apache24/conf/extra) |
| hosts (DNS local) | [C:\Windows\System32\drivers\etc](file:///C:/Windows/System32/drivers/etc) |
| config.inc.php (phpMyAdmin) | [C:\Apache24\htdocs\phpMyAdmin\config.inc.php](file:///C:/Apache24/htdocs/phpMyAdmin/config.inc.php) |
| httpd-alias.conf (Aliases) | [C:\Apache24\conf\extra](file:///C:/Apache24/conf/extra) |
| php.ini (PHP) | [C:\php\php.ini](file:///C:/php/php.ini) |


## Apache

Apache es un servidor web que sirve tus páginas y aplicaciones. En Windows se recomienda descargar los binarios desde Apache Lounge.

### Descarga

- Apache Lounge (binarios recomendados para Windows 64 bits): [https://www.apachelounge.com/download/](https://www.apachelounge.com/download/)

### Instalación

- Descargar el ZIP de Apache 2.4.65 Win64 (VS17).
- Descomprimir en `C:\Apache24` (puedes cambiar la ruta).
- Abrir PowerShell en modo administrador.

### Configuración del DocumentRoot

Editar `C:\Apache24\conf\httpd.conf`:

```bash
Define SRVROOT "C:/Apache24"
ServerRoot "${SRVROOT}"
Include conf/extra/httpd-alias.conf   " este archivo, se configura un poco más abajo, apuntando a las rutas de los proyectos, aunque para esto último se usa si los proyectos van a usar virtualhost y de phpmyadmin que a este si que le vas a tener que añadir una ruta"
```


> [!NOTE] Según Chatgpt lo explica más fino
> ### 1️⃣ `httpd.conf` y `DocumentRoot`

- `DocumentRoot` define la **carpeta principal del servidor web**.
    
- Por defecto, en Apache, suele ser `C:/Apache24/htdocs`.
    
- Todos los proyectos que no tengan un `VirtualHost` se servirán desde aquí, es decir, si escribes `http://localhost/` mostrará lo que haya en `htdocs`.
    

---

### 2️⃣ `httpd-vhosts.conf` y VirtualHost

- Se usa cuando quieres **múltiples proyectos con sus propios dominios locales** (`proyecto-php.com`, `otro-proyecto.local`, etc.).
    
- Cada `VirtualHost` puede tener su propio `DocumentRoot` apuntando a la carpeta específica del proyecto.
    
- Esto **sobre escribe** lo que tienes en `DocumentRoot` global de `httpd.conf` solo para ese dominio.


## Configuración
## de un dominio en virtual host  

``` bash
-- Recordar añadir en --hosts "C:\Windows\System32\drivers\etc\"
-- archivo hosts
-- 127.0.0.1   proyecto-php.com
```

```bash
### Configuración de un dominio virtual

-- "C:\Apache24\conf\extra\httpd-vhosts.conf"
-- "**Nota:** Cambia `4321` por el puerto que quieras usar.  
Si quieres usar el puerto estándar `80`, reemplaza `4321` por `80`."

<VirtualHost *:80>
    ServerName localhost
    DocumentRoot "C:/Apache24/htdocs"
    
    <Directory "C:/Apache24/htdocs">
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>

-- "Este es de prueba para configurar un dominio virtual, muy útil en proyectos en cursos , puedes trabajar en local con el dominio al que tendra, dando un plus de configuración extra ." ---

<VirtualHost *:80>
    ServerName proyecto-php.com
    DocumentRoot "C:/Apache24/htdocs/proyecto/"
    <Directory "C:/Apache24/htdocs/proyecto/">
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>

-- "Abre `C:\Apache24\conf\httpd.conf`"
-- "Quita el `#` para activarla:"
-- "Include conf/extra/httpd-vhosts.conf"

"reseteamos" -- C:\Apache24\bin> .\httpd.exe -k restart
```

#### Probar configuración

```bash
abrir powershell
cd C:\Apache24\bin
.\httpd.exe -t
Debe mostrar: Syntax OK
```

#### Instalar Apache como servicio

```powershell
cd C:\Apache24\bin
.\httpd.exe -k install
net start Apache2.4
```

Reiniciar servicio:

```powershell
net stop Apache2.4
net start Apache2.4
```


# **[volver al índice](#Índice)---


## MariaDB

MariaDB es un sistema gestor de bases de datos, compatible con MySQL.

### Descarga

- Página oficial de MariaDB: [https://mariadb.org/download/](https://mariadb.org/download/)

### Instalación

- Descargar instalador MSI para Windows.
- Ejecutar el asistente de instalación.
- Configurar contraseña del usuario root.
- Activar opción de ejecutar MariaDB como servicio de Windows.

#### Probar instalación

Abrir PowerShell o CMD:

```bash
cd "C:\Program Files\MariaDB 12.0\bin"

.\mysql -u root -p

"Introduce la contraseña que configuraste. Si puedes iniciar sesión, MariaDB está funcionando correctamente."
```

### Añadir MariaDB al PATH

``` bash
- Presiona `Win + S` → escribe "Editar las variables de entorno del sistema" → abrir.
    
- Botón **Variables de entorno** → seleccionar `Path` → **Editar** → **Nuevo**.
    
- Pegar la ruta de `bin` de MariaDB, por ejemplo:
  C:\Program Files\MariaDB 12.0\bin
```


``` bash
-- 'Crear una base de datos'
CREATE DATABASE mibasededatos;

-- 'Ver las bases de datos existentes'
SHOW DATABASES;

-- 'Crear un usuario con contraseña'
CREATE USER 'usuario'@'localhost' IDENTIFIED BY 'contraseña123';

-- 'Dar permisos completos al usuario sobre la base de datos'
GRANT ALL PRIVILEGES ON mibasededatos.* TO 'usuario'@'localhost';

-- 'Aplicar los cambios'
FLUSH PRIVILEGES;
```

# **[volver al índice](#Índice)---


## PHP
### OJO CON LAS VERSIONES X86 - X64

PHP es el lenguaje de programación que ejecuta la lógica de tus aplicaciones web.

``` bash
'Versión incorrecta de PHP x86 / x64 tiene que se la misma que apache'

- Apache que tienes es **2.4 de 64-bit**.
    
- Debes descargar la **versión Thread Safe (TS) de PHP** que coincida con la arquitectura de Apache (x64 o x86).
    
- 'En [php.net para Windows](https://windows.php.net/download/?utm_source=chatgpt.com), asegúrate de elegir:'
    
    - **Thread Safe**
        
    - **x64** (si tu Apache es 64-bit)
        
    - Por ejemplo: `php-8.2.x-Win32-vs16-x64.zip`
```

### Descarga

- Página oficial de PHP para Windows: [https://windows.php.net/download/](https://windows.php.net/download/)

### Instalación

- Descargar PHP (por ejemplo, php-8.3.x-Win64-vs17.zip).
- Descomprimir en `C:\php`.
- Renombrar `php.ini-development` a `php.ini`.
- Abrimos php.ini
- Activar extensiones necesarias:

```ini
extension_dir = "ext"
extension=mysqli
extension=curl
extension=gd
extension=mbstring
extension=pdo_mysql
extension_dir = "C:/php/ext"
```

### Integrar PHP con Apache

Editar `C:\Apache24\conf\httpd.conf` y añadir al final de los módulos cargados:

```bash
# PHP
"despues de LoadModule negotiation_module modules/mod_negotiation.so añades :"

LoadModule php_module "C:/php/php8apache2_4.dll"
AddHandler application/x-httpd-php .php
PHPIniDir "C:/php"

Guardar los cambios y reiniciar Apach

cd C:\Apache24\bin
.\httpd.exe -k restart
```

Crear archivo de prueba en `C:/php/web/info.php`:

```php
<?php phpinfo(); ?>
```

Abrir en navegador: [http://localhost/info.php](http://localhost/info.php) → Debe mostrar la información de PHP.

# **[volver al índice](#Índice)---



### PHPmyAdmin
### INTEGRACIÓN CON SISTEMA GRÁFICO

- Ve a https://www.phpmyadmin.net/downloads/ y descarga la versión **zip** (no el paquete con servidor incluido).
    
- Descomprime el contenido en tu carpeta de proyectos, por ejemplo:
    
    `C:/php/phpmyadmin/`


### **2. Configurar 
### phpMyAdmin**

- `config.sample.inc.php` renómbralo a `config.inc.php`.
    
- Edita `config.inc.php` con tu editor de texto:

``` bash
<?php
/**
 * Archivo de configuración de phpMyAdmin para Windows
 * Adaptado a MariaDB en localhost con Apache y PHP
 */

declare(strict_types=1);

/**
 * Secret para encriptar cookies (32 caracteres aleatorios)
 * Puedes generar uno con cualquier generador online de 32 caracteres.
 */
$cfg['blowfish_secret'] = 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6'; // ¡Cámbialo por uno único!

/**
 * Servidores de base de datos
 */
$i = 0;
$i++;

// Primer servidor
$cfg['Servers'][$i]['auth_type'] = 'cookie';    // Autenticación por cookie
$cfg['Servers'][$i]['host'] = '127.0.0.1';      // Servidor MariaDB
$cfg['Servers'][$i]['port'] = '3306';           // Puerto por defecto
$cfg['Servers'][$i]['user'] = 'root';           // Usuario MariaDB
$cfg['Servers'][$i]['password'] = '123456';           // Contraseña (vacía si no hay)
$cfg['Servers'][$i]['AllowNoPassword'] = true;  // Solo true si root no tiene contraseña

/**
 * Configuración de almacenamiento de phpMyAdmin (opcional)
 * Puedes dejarlo comentado si no quieres usar estas tablas.
 */
// $cfg['Servers'][$i]['controluser'] = 'pma';
// $cfg['Servers'][$i]['controlpass'] = 'pmapass';
// $cfg['Servers'][$i]['pmadb'] = 'phpmyadmin';
// $cfg['Servers'][$i]['bookmarktable'] = 'pma__bookmark';
// $cfg['Servers'][$i]['relation'] = 'pma__relation';
// ... (otras tablas de configuración)

/**
 * Directorios para subir y guardar archivos desde phpMyAdmin
 */
$cfg['UploadDir'] = '';
$cfg['SaveDir'] = '';

/**
 * Opciones adicionales (opcional)
 */
$cfg['DefaultLang'] = 'en';       // Idioma por defecto
$cfg['ShowAll'] = true;           // Mostrar botón "ver todo" en browse
$cfg['QueryHistoryDB'] = true;    // Guardar historial de consultas en DB
$cfg['QueryHistoryMax'] = 100;    // Máximo de entradas de historial
```

---

# **[volver al índice](#Índice)---


### **Configuramos  
### Apache**

-  En `httpd.conf` incluir enlace de Alias / crear archivo:

``` bash
--- Include conf/extra/httpd-alias.conf
```

- En `httpd-alias.conf` configuramos las rutas de los alias -- PROYECTOS -- Y PHPMYADMIN:
- Diferentes proyectos en su ruta , phpMyAdmin tambien.
- El phpMyAdmin por seguridad lo mantenemos en C:/php/phpMyadmin
- Los proyectos en C:/Apache24/htdocs/

``` bash
Alias /phpmyadmin "C:/php/phpMyAdmin"

<Directory "C:/php/phpMyAdmin">
    Options Indexes FollowSymLinks
    AllowOverride All
    Require all granted
    DirectoryIndex index.php index.html
</Directory>

Alias /web "C:/Apache24/htdocs/web/"

<Directory "C:/Apache24/htdocs/web/">
    Options Indexes FollowSymLinks
    AllowOverride All
    Require all granted
</Directory>


Alias /proyecto "C:/Apache24/htdocs/proyecto"

<Directory "C:/Apache24/htdocs/proyecto">
    Options Indexes FollowSymLinks
    AllowOverride All
    Require all granted
    DirectoryIndex index.php index.html
</Directory>





```
    
- Reinicia Apache:
    
    `C:\Apache24\bin> .\httpd.exe -k restart`
    
---
# **[volver al índice](#Índice)---



## Apache y MariaDB como **servicios automáticos en Windows**

## apache_automatico
## 1. **Apache**

1. Abre **cmd** como administrador.
    
2. Ejecuta este comando para instalar Apache como servicio:
    

``` bash
C:\Apache24\bin\httpd.exe -k install -n "Apache24"
```

- `-n "Apache24"` es el nombre que tendrá el servicio (puedes poner otro).
    
### 2. Configura el servicio para que arranque automáticamente:
    

``` bash
sc config Apache24 start= auto
```

### 3. Ahora puedes iniciar Apache manualmente si quieres (solo la primera vez o para probar):
    
``` bash
net start Apache24
net stop Apache24
```


# **[volver al índice](#Índice)---


## Iniciar MariaDB en 
## automático
### **Mariadb**

1. Abre **cmd** como administrador.
    
2. Instala MariaDB como servicio (asumiendo que `mysqld.exe` está en `C:\MariaDB\bin`):
    
``` bash
"C:\Program Files\MariaDB 12.0\bin\mysqld.exe" --install MariaDB
```


3. Configura el servicio para que arranque automáticamente:
    
``` bash
sc config MariaDB start= auto
```

4. Inicia el servicio y detener:
    

``` bash
net start MariaDB
```

``` bash
net stop MariaDB
```

# **[volver al índice](#Índice)---



## Script
## **script en PowerShell** de reinicia

### Guárdalo como `reiniciar-servicios.ps1`:

``` bash
# Verifica si PowerShell está en modo administrador
If (-Not ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator"))
{
    Write-Warning "El script no está en modo administrador. Se reiniciará elevando permisos..."
    Start-Process powershell "-ExecutionPolicy Bypass -File `"$PSCommandPath`"" -Verb RunAs
    Exit
}

# -------------------------------
# Script para reiniciar Apache, MariaDB y comprobar PHP
# -------------------------------

# Nombres de los servicios
$apacheService = "Apache24"
$mariaService = "MariaDB"

# Función para reiniciar un servicio
function Reiniciar-Servicio($servicio) {
    Write-Host "`nReiniciando servicio: $servicio ..."
    if ((Get-Service -Name $servicio -ErrorAction SilentlyContinue).Status -eq "Running") {
        Stop-Service -Name $servicio -Force
        Start-Sleep -Seconds 2
    }
    Start-Service -Name $servicio
    Write-Host "Servicio $servicio iniciado."
}

# Reiniciar Apache y MariaDB
Reiniciar-Servicio $apacheService
Reiniciar-Servicio $mariaService

# Comprobar PHP
Write-Host "`nVerificando PHP..."
$phpPath = "C:\php\php.exe"  # Ajusta si tu php.exe está en otra ruta
if (Test-Path $phpPath) {
    & $phpPath -v
} else {
    Write-Host "No se encontró PHP en $phpPath"
}

Write-Host "`nTodos los servicios han sido reiniciados."

```

## **script en PowerShell** de detener servicios

### Guárdalo como `detener-servicios.ps1`:

``` bash
# Verifica si PowerShell está en modo administrador
If (-Not ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator"))
{
    Write-Warning "El script no está en modo administrador. Se reiniciará elevando permisos..."
    Start-Process powershell "-ExecutionPolicy Bypass -File `"$PSCommandPath`"" -Verb RunAs
    Exit
}

# -------------------------------
# Script para detener Apache y MariaDB
# -------------------------------

# Nombres de los servicios
$apacheService = "Apache24"
$mariaService  = "MariaDB"

# Función para detener un servicio
function Detener-Servicio($servicio) {
    Write-Host "`nDeteniendo servicio: $servicio ..."
    if ((Get-Service -Name $servicio -ErrorAction SilentlyContinue).Status -eq "Running") {
        Stop-Service -Name $servicio -Force
        Write-Host "Servicio $servicio detenido."
    } else {
        Write-Host "El servicio $servicio ya estaba detenido."
    }
}

# Detener servicios
Detener-Servicio $apacheService
Detener-Servicio $mariaService

Write-Host "`nTodos los servicios han sido detenidos."
```

# **[volver al índice](#Índice)---



## Recursos 
### y Documentación Oficial

- Apache HTTP Server: [https://httpd.apache.org/](https://httpd.apache.org/)
- Apache Lounge (Windows binaries): [https://www.apachelounge.com/download/](https://www.apachelounge.com/download/)
- MariaDB: [https://mariadb.org/download/](https://mariadb.org/download/)
- PHP para Windows: [https://windows.php.net/download/](https://windows.php.net/download/)

# **[volver al índice](#Índice)---