<?php

    $servername = "localhost";
    $username = "root";
    $password = "123456";
    $dbname = "comunidad";

    /* TODO: Creamos la conexión a la base de datos
     * Descripción: Creamos la conexión a la base de datos usando mysqli_connect
     * y verificamos si la conexión fue exitosa o no.
     */

    $conexion = mysqli_connect($servername, $username, $password, $dbname);

    if (!$conexion) {
        die("La conexión ha fallado: " . mysqli_connect_error());
    } 