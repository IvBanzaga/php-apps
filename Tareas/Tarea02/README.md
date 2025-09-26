# Estructura recomendada MVC para PHP

```
Tarea02/
├── app/
│   ├── Controllers/
│   │   └── ComunidadController.php
│   ├── Models/
│   │   └── Comunidad.php
│   └── Views/
│       └── comunidad/
│           └── index.php
├── config/
│   └── database.php
├── public/
│   └── index.php
├── composer.json
└── README.md
```

- Usa PSR-4 para autoloading (composer).
- Los nombres de archivos y clases coinciden (case-sensitive).
- Controladores con sufijo `Controller`.
- Modelos en singular.
- Vistas organizadas por recurso.
- Conexión a BD en `config/database.php`.
- Punto de entrada único en `public/index.php`.
