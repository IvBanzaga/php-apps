<?php

/* TODO: Función de autocarga de clases
 * Descripción: Esta función intenta cargar la clase especificada
 * buscando un archivo con el mismo nombre que la clase.
 * Si el archivo existe, lo incluye.
 * Ejemplo: Clase Usuario -> Usuario.php
 * Facilita no tener que hacer muchos require_once
 * Contiene la lógica para cargar las clases automáticamente
 */

function autoload($clase)
{
    $folders = [
        __DIR__ . "/app/Config/",
        __DIR__ . "/app/Controllers/",
        __DIR__ . "/app/Models/",
        __DIR__ . "/app/Views/",
        __DIR__ . "/data/vecinos.dat"
    ];

    foreach ($folders as $folder) {
        $file = $folder . $clase . ".php";
        if (file_exists($file)) {
            require_once($file);
            return;
        }
    }

    error_log("No se pudo cargar la clase: $clase");
}

/* TODO: Registro de la función de autocarga
 * Descripción: Registra la función de autocarga para que PHP la llame
 * automáticamente cuando se intenta utilizar una clase no definida.
 */
spl_autoload_register("autoload");
