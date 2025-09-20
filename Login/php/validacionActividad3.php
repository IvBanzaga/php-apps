<?php

if (isset($_POST["btnBuscar"])) {
    $palabra = $_POST["txtPalabra"];
    buscarArticulos($palabra);
}

function buscarArticulos($palabra)
{
    // Declaramos e inicializamos las variables necesarias para conectar a la base de datos
    $serverName = "localhost";
    $userName = "root";
    $password = "123456";
    $database = "negociophp";

    // Vamos a crear la conexión
    $conn = mysqli_connect($serverName, $userName, $password, $database);

    // Vamos a comprobar si la conexión ha sido correcta
    if (!$conn) {
        error_log("Fallo al intentar conectar a la base de datos  $database: " . mysqli_connect_error());
    } else {
        echo "¡Felicidades! Se ha conseguido conectar correctamente a la base de datos $database <br>";

        // Vamos a establecer el conjunto de caracteres predeterminado a usar cuando se envían datos desde y hacia el servidor de la base de datos.
        mysqli_set_charset($conn, "utf8");
    }

    $consulta = "SELECT * FROM articulo WHERE nombre LIKE '%$palabra%'";

    $resultado = mysqli_query($conn, $consulta);

    // Verifica si la consulta se ejecutó correctamente
    if ($resultado) {
        // Verifica si se encontraron resultados
        if ($resultado->num_rows > 0) {
            while ($fila = $resultado->fetch_assoc()) {
                echo "<p>Id: " . $fila["id"] . "</p>";
                echo "<p>Nombre: " . $fila["nombre"] . "</p>";
                echo "<p>Precio: " . $fila["precio"] . "</p>";
                echo "<br>";
            }
        } else {
            echo "<p>No se encontraron resultados para la palabra buscada.</p>";
        }
    } else {
        echo "Error al ejecutar la consulta: " . mysqli_error($conn);
    }


    mysqli_close($conn);
}