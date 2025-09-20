<?php

/*
	isset = función de PHP ya predefinida, que tiene entre otras funciones comprobar si se 	ha pulsado el botón en el formulario.
    $_POST = variable "súper global" en PHP que es un array y permite recuperar los datos enviados desde el formulario.

*/
if (isset($_POST["btnAcceder"])) {
	$cliente = $_POST["nombre_usuario"];
	$pais = $_POST["passw_usuario"];

	echo "<br>El usuario que ha introducido es: $cliente y la contraseña es: $pais <br>";
	conectar($cliente, $pais);
}

function conectar($cliente, $pais)
{
	echo "Se ha llamado a la función conectar()";
	// Declaramos e inicializamos las variables necesarias para conectar a la base de datos
	$serverName = "localhost";
	$userName = "root";
	$password = "123456";
	$database = "negociophp";

	// Vamos a crear la conexión
	$conn = mysqli_connect($serverName, $userName, $password, $database);

	// Vamos a comprobar si la conexión ha sido  correcta

	if (!$conn) {
		error_log("Fallo al intentar conectar a la base de datos  $database: " . mysqli_connect_error());
	} else {
		echo "¡Felicidades! Se ha conseguido conectar correctamente a la base de datos $database <br>";

		// Vamos a establecer el conjunto de caracteres predeterminado a usar cuando se envían datos desde y hacia el servidor de la base de datos.
		mysqli_set_charset($conn, "utf8");
	}
		// Creamos la consulta SQL que queremos ejecutar

		/* TODO:  */
		//$consulta = "SELECT COUNT(*) FROM USUARIO WHERE NombreUsuario = '$user' and Password = BINARY '$passw'";
		//echo "La consulta que estamos ejecutando en MySQL es: " . $consulta . "<br>";

		/* TODO: Consulta para comprobar el nombre NAGORE  */
		//$consulta = "SELECT COUNT(*) FROM cliente WHERE NOMBRE = 'NAGORE' AND contraseña = (SELECT id FROM pais WHERE NOMBRE = 'NAGORE')

		/* TODO: Consulta para comprobar la existencia del cliente  */
		//$consulta = "SELECT COUNT(*) FROM cliente WHERE nombre = '$nombre' AND contraseña = (SELECT id FROM pais WHERE nombre = '$pais')";

		/* TODO: Consulta para comprobar la existencia del cliente y su país */
		$consulta = "SELECT COUNT(*) FROM cliente INNER JOIN pais_cliente ON cliente.id = pais_cliente.id_cliente
		INNER JOIN Pais  ON pais_cliente.id_pais = pais.id WHERE cliente.name = '$cliente' and pais.name = '$pais'";

		$resultado = $conn->query($consulta);

	// Verifica si se encontraron resultados
if ($resultado->num_rows > 0) {
    while ($fila = $resultado->fetch_assoc()) {
        echo "<p>Identificación: " . $fila["id"] . "</p>";
        echo "<p>Nombre: " . $fila["name"] . "</p>";
        echo "<p>Primer Apellido: " . $fila["surname"] . "</p>";
        echo "<p>Segundo Apellido: " . $fila["surname2"] . "</p>";
    }
} else {
    echo "<p>No se encontraron resultados para el número de cliente ingresado.</p>";
}

$conn->close();


			/*$resultado = mysqli_query($conn, $consulta);
		$tupla = mysqli_fetch_row($resultado);
		$encontrado = $tupla[0];

		echo "<br> Se han encontrado un total de: " . $encontrado . " coincidencia/s para ese CLIENTE y PAIS introducidos<br>";
		mysqli_close($conn);
		validar($encontrado);
	}

// function validar($validado)
// {
// 	if ($validado) { // es lo mismo que poner: $validado == 1
// 		echo "<br> Bienvenido. Se ha logueado correctamente";
// 	} else {
// 		echo "<br>Ese usuario y contraseña no corresponden a ningún usuario.";
// 	}
// }*/
}