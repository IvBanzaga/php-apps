<?php

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

	// Vamos a comprobar si la conexión ha sido correcta

	/*if (!$conn) {
		error_log("Fallo al intentar conectar a la base de datos  $database: " . mysqli_connect_error());
	} else {
		echo "¡Felicidades! Se ha conseguido conectar correctamente a la base de datos $database <br>";

		// Vamos a establecer el conjunto de caracteres predeterminado a usar cuando se envían datos desde y hacia el servidor de la base de datos.
		mysqli_set_charset($conn, "utf8");
	}*/

	$consulta = "SELECT COUNT(*) FROM cliente INNER JOIN pais_cliente ON cliente.id = pais_cliente.id_cliente
	INNER JOIN Pais  ON pais_cliente.id_pais = pais.id WHERE cliente.name = '$cliente' and pais.name = '$pais'";

	$resultado = mysqli_query($conn, $consulta);
	$tupla = mysqli_fetch_row($resultado);
	$encontrado = $tupla[0];
	if ($encontrado > 0) // Si obtuvo resultados, hay coincidencia de cliente y pais.
	{
		echo "<br> Se han encontrado un total de: " . $encontrado . " coincidencia/s para ese CLIENTE y PAIS introducidos<br>";
		$consulta = "SELECT * FROM cliente WHERE name = '$cliente'";
		$resultado = $conn->query($consulta);

		// Verifica si se encontraron resultados
		if ($resultado->num_rows > 0) {

			while ($fila = $resultado->fetch_assoc()) {
				echo "<p>Identificación: " . $fila["id"] . "</p>";
				echo "<p>Nombre: " . $fila["name"] . "</p>";
				echo "<p>Primer Apellido: " . $fila["surname"] . "</p>";
				echo "<p>Segundo Apellido: " . $fila["surname2"] . "</p>";

				validar($encontrado);
			}
		}
	} else {
		echo "<br> Se han encontrado un total de: " . $encontrado . " coincidencia/s para ese CLIENTE y PAIS introducidos<br>";
	}
}

function validar($validado)
{
	if ($validado) { // es lo mismo que poner: $validado == 1
		echo "<br> Bienvenido. Se ha logueado correctamente";
	} else {
		//echo "<br>Ese usuario y contraseña no corresponden a ningún usuario.";
		echo "<h3>No se ha encontrado ningún Cliente con ese nombre o que sea de ese país.</h3>";
	}
}