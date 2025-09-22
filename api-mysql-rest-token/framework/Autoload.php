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
        __DIR__ . "/Config/",
        __DIR__ . "/Helpers/",
        __DIR__ . "/Controllers/",
        __DIR__ . "/Models/",
        __DIR__ . "/Libraries/Core/",
        __DIR__ . "/Libraries/",
        __DIR__ . "/Views/",
        __DIR__ . "/Views/Errors/"
    ];

    foreach ($folders as $folder) {
        $file = $folder . $clase . ".php";
        if (file_exists($file)) {
            require_once($file);
            return;
        }
    }
}

/* TODO: Registro de la función de autocarga
 * Descripción: Registra la función de autocarga para que PHP la llame
 * automáticamente cuando se intenta utilizar una clase no definida.
 */
spl_autoload_register("autoload");
