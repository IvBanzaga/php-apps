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
# Instalación y configuración: Apache, MariaDB y PHP en Windows (sin XAMPP)

Resumen práctico para instalar y configurar Apache, MariaDB y PHP en Windows usando binarios (sin XAMPP). Contiene ejemplos de VirtualHost, alias para phpMyAdmin y scripts PowerShell útiles.

## Índice

1. [Apache](#apache)
2. [MariaDB](#mariadb)
3. [PHP](#php)
4. [VirtualHosts (httpd-vhosts.conf)](#virtualhosts)
5. [phpMyAdmin](#phpmyadmin)
6. [Aliases y httpd-alias.conf](#aliases)
7. [Servicios (Windows)](#servicios)
8. [Scripts PowerShell útiles](#scripts)
9. [Recursos](#recursos)

---

> Nota: los enlaces a carpetas locales (ej. `C:\Apache24\conf`) están pensados para abrir en tu sistema. Ajusta rutas según tu instalación.

## Apache

Apache es el servidor web. Se recomienda descargar los binarios para Windows desde Apache Lounge.

### Descarga

- Apache Lounge: https://www.apachelounge.com/download/

### Instalación básica

1. Descarga el ZIP (ej. Apache 2.4.x Win64).
2. Descomprime en `C:\Apache24` (o la ruta que prefieras).
3. Abre PowerShell/CMD como administrador para los pasos siguientes.

### Configuración mínima en `httpd.conf`

Añade o verifica las siguientes líneas (ajusta rutas si es necesario):

```text
Define SRVROOT "C:/Apache24"
ServerRoot "${SRVROOT}"
Include conf/extra/httpd-alias.conf
# DocumentRoot por defecto: C:/Apache24/htdocs
```

`DocumentRoot` define la carpeta que Apache sirve en `http://localhost/` si no usas VirtualHosts.

## VirtualHost

Usa `httpd-vhosts.conf` para servir varios proyectos con dominios locales distintos.

Ejemplo (`C:/Apache24/conf/extra/httpd-vhosts.conf`):

```apache
<VirtualHost *:80>
    ServerName localhost
    DocumentRoot "C:/Apache24/htdocs"
    <Directory "C:/Apache24/htdocs">
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>

<VirtualHost *:80>
    ServerName proyecto-php.local
    DocumentRoot "C:/Apache24/htdocs/proyecto"
    <Directory "C:/Apache24/htdocs/proyecto">
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

Recuerda añadir la entrada en tu archivo hosts (`C:\Windows\System32\drivers\etc\hosts`):

```text
127.0.0.1 proyecto-php.local
```

Para comprobar la configuración de Apache:

```powershell
cd C:\Apache24\bin
.\httpd.exe -t
# Debe mostrar: Syntax OK
```

Para reiniciar Apache:

```powershell
cd C:\Apache24\bin
.\httpd.exe -k restart
```

Si quieres instalar Apache como servicio:

```powershell
cd C:\Apache24\bin
.\httpd.exe -k install -n "Apache24"
sc config Apache24 start= auto
net start Apache24
```

## MariaDB

MariaDB es compatible con MySQL. Instálalo usando el instalador MSI oficial.

### Pasos básicos

1. Descarga el instalador: https://mariadb.org/download/
2. Ejecuta el instalador y sigue el asistente.
3. Anota la contraseña de `root` y marca la opción para instalar como servicio si lo deseas.

Probar conexión desde CMD/PowerShell:

```powershell
cd "C:\Program Files\MariaDB 12.0\bin"
.\mysql -u root -p
# Introduce la contraseña cuando te la pida
```

Crear base de datos y usuario (ejemplo):

```sql
CREATE DATABASE mibasededatos;
SHOW DATABASES;
CREATE USER 'usuario'@'localhost' IDENTIFIED BY 'contraseña123';
GRANT ALL PRIVILEGES ON mibasededatos.* TO 'usuario'@'localhost';
FLUSH PRIVILEGES;
```

Si instalaste MariaDB en otra ruta, añade su `bin` al PATH del sistema.

## PHP

Descarga la versión Thread Safe (TS) que coincida con la arquitectura de Apache (x64/x86): https://windows.php.net/download/

### Instalación básica

1. Descarga y descomprime en `C:\php`.
2. Renombra `php.ini-development` a `php.ini` y edítalo.
3. Activa extensiones necesarias (ejemplo):

```ini
extension_dir = "C:/php/ext"
extension=mysqli
extension=curl
extension=gd
extension=mbstring
extension=pdo_mysql
```

### Integrar PHP con Apache

En `C:\Apache24\conf\httpd.conf` añade (después de otros LoadModule):

```apache
LoadModule php_module "C:/php/php8apache2_4.dll"
AddHandler application/x-httpd-php .php
PHPIniDir "C:/php"
```

Reinicia Apache:

```powershell
cd C:\Apache24\bin
.\httpd.exe -k restart
```

Prueba con `C:/php/www/info.php` (o en `htdocs`):

```php
<?php phpinfo(); ?>
```

Accede a: http://localhost/info.php

## Configurar e instalación de PhpMyAdmin

Descarga la versión zip desde https://www.phpmyadmin.net/downloads/ y descomprime en `C:/php/phpMyAdmin`.

Renombra `config.sample.inc.php` a `config.inc.php` y configura lo esencial:

```php
<?php
$cfg['blowfish_secret'] = 'CAMBIA_POR_UNA_CADENA_UNICA';
$i = 0; $i++;
$cfg['Servers'][$i]['auth_type'] = 'cookie';
$cfg['Servers'][$i]['host'] = '127.0.0.1';
$cfg['Servers'][$i]['port'] = '3306';
$cfg['Servers'][$i]['user'] = 'root';
$cfg['Servers'][$i]['password'] = '';
$cfg['Servers'][$i]['AllowNoPassword'] = false;
```

Nota: guarda las tablas de configuración de phpMyAdmin solo si realmente las necesitas (controluser, pmadb, etc.).

## Configurar Apache

Para acceder a phpMyAdmin y otros proyectos mediante alias, añade en `conf/extra/httpd-alias.conf`:

```apache
Alias /phpmyadmin "C:/php/phpMyAdmin"
<Directory "C:/php/phpMyAdmin">
    Options Indexes FollowSymLinks
    AllowOverride All
    Require all granted
    DirectoryIndex index.php index.html
</Directory>

Alias /proyecto "C:/Apache24/htdocs/proyecto"
<Directory "C:/Apache24/htdocs/proyecto">
    Options Indexes FollowSymLinks
    AllowOverride All
    Require all granted
</Directory>
```

Reinicia Apache después de cambiar estos archivos.

## Iniciar Apache en modo automático

Instalar Apache como servicio:

```powershell
cd C:\Apache24\bin
.\httpd.exe -k install -n "Apache24"
sc config Apache24 start= auto
net start Apache24
```

## Iniciar MariaDB en modo automático

```powershell
"C:\Program Files\MariaDB 12.0\bin\mysqld.exe" --install MariaDB
sc config MariaDB start= auto
net start MariaDB
```

## Script en PowerShell que reinicia

Guarda como `reiniciar-servicios.ps1` para reiniciar Apache y MariaDB:

```powershell
If (-Not ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Start-Process powershell "-ExecutionPolicy Bypass -File `"$PSCommandPath`"" -Verb RunAs
    Exit
}

$apacheService = "Apache24"
$mariaService  = "MariaDB"

function Reiniciar-Servicio($servicio) {
    if ((Get-Service -Name $servicio -ErrorAction SilentlyContinue).Status -eq 'Running') {
        Stop-Service -Name $servicio -Force
        Start-Sleep -Seconds 2
    }
    Start-Service -Name $servicio
}

Reiniciar-Servicio $apacheService
Reiniciar-Servicio $mariaService

$phpPath = 'C:\php\php.exe'
if (Test-Path $phpPath) { & $phpPath -v } else { Write-Host "No se encontró PHP en $phpPath" }

Write-Host "Servicios reiniciados."
```

Y `detener-servicios.ps1` para detenerlos:

```powershell
If (-Not ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Start-Process powershell "-ExecutionPolicy Bypass -File `"$PSCommandPath`"" -Verb RunAs
    Exit
}

$apacheService = "Apache24"
$mariaService  = "MariaDB"

function Detener-Servicio($servicio) {
    if ((Get-Service -Name $servicio -ErrorAction SilentlyContinue).Status -eq 'Running') {
        Stop-Service -Name $servicio -Force
    }
}

Detener-Servicio $apacheService
Detener-Servicio $mariaService

Write-Host "Servicios detenidos."
```

## Recursos

- Apache HTTP Server: https://httpd.apache.org/
- Apache Lounge (binarios para Windows): https://www.apachelounge.com/download/
- MariaDB: https://mariadb.org/download/
- PHP para Windows: https://windows.php.net/download/

---

Fin del documento.