<?php
class Conexion
{

    /* TODO: Variable de conexión a la base de datos
     * Descripción: Esta variable almacena la conexión a la base de datos.
     */
    protected $conect;
    private $dbhosting = "localhost";
    private $dbname = "db_api_token";
    private $dbuser = "root";
    private $dbpass = "123456";

    /* TODO: Constructor de la clase Conexion
     * Descripción: Este constructor establece la conexión a la base de datos.
     */
    public function __construct()
    {
        /* TODO: Definimos la conexión
         * Descripción: Establece la conexión a la base de datos utilizando PDO.
         */
        try {
            $conectionString = "mysql:host=".$this->dbhosting.";dbname=".$this->dbname.";charset=utf8"; // Cadena de conexión a la base de datos
            $this->conect = new PDO($conectionString, $this->dbuser, $this->dbpass); // Establece la conexión a la base de datos
            $this->conect->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); // Configura el modo de error de PDO a excepción
        } catch (PDOException $e) {
            $this->conect = null; // Asigna null en caso de error de conexión
            echo "Error de conexion: " . $e->getMessage(); // Muestra el mensaje de error
        }
    }

    /* TODO: Método para obtener la conexión, no es necesario
     * Descripción: Este método devuelve la conexión a la base de datos.
     */
    public function getConexion()
    {
        return $this->conect;
    }
}