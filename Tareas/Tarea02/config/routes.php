<?php

/* TODO: Definir BASE_URL VS and APACHE */
if (isset($_SERVER['SERVER_PORT']) && $_SERVER['SERVER_PORT'] == 3000) {
    // VS Code PHP Server
    define('BASE_URL', '/Tarea02/public/');
} else {
    // Apache
    define('BASE_URL', '/Tareas/Tarea02/public/');
}
$config_default_action = 'index';
