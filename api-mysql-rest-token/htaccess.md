# Explicación del archivo `.htaccess` para URLs limpias en PHP

Este archivo `.htaccess` permite habilitar **URLs limpias** y mejorar la seguridad básica en un proyecto PHP tipo MVC o API.

---

## 1️⃣ Seguridad básica

```apacheconf
Options All -Indexes
```
Evita que se pueda listar el contenido de los directorios si no hay un archivo `index.*`. Recomendable para seguridad básica.

```apacheconf
Options -MultiViews
```
Desactiva la negociación de contenido de Apache. Evita conflictos con URLs limpias que puedan coincidir parcialmente con nombres de archivos.

---

## 2️⃣ Activar el motor de reescritura

```apacheconf
RewriteEngine on
```
Activa `mod_rewrite`, necesario para redirigir URLs.

---

## 3️⃣ Condiciones para la reescritura

```apacheconf
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME} !-f
```
Solo aplica la regla si la URL no apunta a un directorio ni a un archivo existente. Evita sobrescribir archivos reales como imágenes, CSS o JS.

---

## 4️⃣ Regla de reescritura principal

```apacheconf
RewriteRule ^(.*)$ index.php?url=$1 [QSA,L]
```
Captura toda la URL (`^(.*)$`) y la pasa a `index.php` como parámetro `url`.
- `[QSA]` → conserva la query string original (GET).
- `[L]` → indica que es la última regla que se aplica si coincide.

---

## 5️⃣ Ejemplo práctico

**URL visitada:**
```
http://midominio.com/productos/ver/12
```
Apache verifica si existe el archivo o directorio `productos/ver/12`. Si no existe, redirige a:
```
index.php?url=productos/ver/12
```
Tu `index.php` puede usar `$_GET['url']` para enrutar internamente al controlador o vista correspondiente.

---

## 💡 Notas adicionales

- Este `.htaccess` es útil para frameworks propios o mini-MVC.
- Puede mejorarse añadiendo:
  - Redirección a HTTPS
  - Eliminación de www
  - Página de error 404 personalizada
