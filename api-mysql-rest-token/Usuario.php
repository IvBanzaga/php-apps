<?php

require_once 'Autoload.php'; // Incluye el archivo Autoload.php para cargar las clases automáticamente



/* TODO:  Clase que representa a un usuario en el sistema.
 * Descripción: Esta clase proporciona métodos para interactuar con la tabla de usuarios en la base de datos.
 */
class Usuario extends Conexion
{
    private $intId;
    private $strNombre;
    private $intTelefono;
    private $strEmail;
    private $strDireccion;




    /* TODO: Constructor de la clase Usuario
     * Descripción: Este constructor inicializa la conexión a la base de datos.
     */
    public function __construct()
    {
        parent::__construct(); // Llama al constructor de Conexion para inicializar $this->conect

    }

    /* TODO: Método para insertar un nuevo usuario
     * @param string $nombre - Nombre del usuario
     * @param int $telefono - Teléfono del usuario
     * @param string $email - Email del usuario
     * @param string $direccion - Dirección del usuario
     * Descripción: Este método inserta un nuevo usuario en la base de datos.
     */
    public function insertarUsuario(string $nombre, int $telefono, string $email, string $direccion)
    {
        /* TODO: Comprobación de conexión
         * Descripción: Verifica si hay una conexión activa a la base de datos.
         */
        if ($this->conect === null) {
            echo "No hay conexión a la base de datos.";
            return null;
        }

        try {

            $this->strNombre = $nombre;
            $this->intTelefono = $telefono;
            $this->strEmail = $email;
            $this->strDireccion = $direccion;

            $sql = "INSERT INTO usuario (nombre, telefono, email, direccion) VALUES (:nom, :tel, :email, :dir)"; // Consulta SQL para insertar un nuevo usuario
            $insert = $this->conect->prepare($sql); // Prepara la consulta SQL para su ejecución asociando la conexion a la base de datos

            // Vincula los parámetros a los valores correspondientes
            $arrData = array(
                ':nom' => $this->strNombre,
                ':tel' => $this->intTelefono,
                ':email' => $this->strEmail,
                ':dir' => $this->strDireccion
            );

            $resInsert = $insert->execute($arrData); // Ejecuta la consulta con los datos
            $idInsert = $this->conect->lastInsertId(); // Obtiene el ID del último registro insertado
            $insert->closeCursor(); // Cierra el cursor de la consulta
            return $idInsert; // Retorna el ID del nuevo usuario insertado
        } catch (PDOException $e) {
            echo "Error al insertar el usuario: " . $e->getMessage(); // Muestra el mensaje de error en caso de excepción
        }
    }

    /* TODO: Método para obtener todos los usuarios
     * Descripción: Este método retorna un array con todos los usuarios registrados en la base de datos.
     */
    public function getUsuarios()
    {
        if ($this->conect === null) {
            echo "No hay conexión a la base de datos.";
            return null;
        }

        try {
            $sql = "SELECT * FROM usuario";
            $execute = $this->conect->query($sql);
            $request = $execute->fetchall(PDO::FETCH_ASSOC); //Array para retornar todos los usuarios
            //$request = $execute->fetchall(PDO::FETCH_CLASS); //Otra forma de retornar todos los usuarios como objetos
            $execute->closeCursor();
            return $request;
        } catch (Exception $e) {
            echo "Error: " . $e->getMessage();
        }
    }

    /* TODO: Método para obtener un usuario por su ID
     * @param int $id - ID del usuario a obtener
     * Descripción: Este método retorna un array con los datos del usuario
     * correspondiente al ID proporcionado.
     */
    public function getUsuario(int $id)
    {
        if ($this->conect === null) {
            echo "No hay conexión a la base de datos.";
            return null;
        }

        try {
            $this->intId = $id;
            $sql = "SELECT * FROM usuario WHERE idusuario = :id";
            $arrData = array(":id" => $this->intId);
            $query = $this->conect->prepare($sql);
            $query->execute($arrData);
            $request = $query->fetch(PDO::FETCH_ASSOC); //ARRAY
            $query->closeCursor();
            return $request;
        } catch (Exception $e) {
            echo "Error: " . $e->getMessage();
        }
    }

    /* TODO: Método para actualizar un usuario
     * Descripción: Este método actualiza los datos de un usuario existente en la base de datos.
     */
    public function updateUsuario(int $id, string $nombre, int $telefono, string $email, string $direccion)
    {
        if ($this->conect === null) {
            echo "No hay conexión a la base de datos.";
            return null;
        }

        try {
            $this->intId = $id;
            $this->strNombre = $nombre;
            $this->intTelefono = $telefono;
            $this->strEmail = $email;
            $this->strDireccion = $direccion;

            $sql = "UPDATE usuario SET nombre = :nom, telefono = :tel, email = :email, direccion = :dir WHERE idusuario = :id ";
            $update = $this->conect->prepare($sql);
            $arrData = array(
                ":nom" => $this->strNombre,
                ":tel" => $this->intTelefono,
                ":email" => $this->strEmail,
                ":dir" => $this->strDireccion,
                ":id" => $this->intId
            );
            $resUdpate = $update->execute($arrData);
            $update->closeCursor();
            return $resUdpate;
        } catch (Exception $e) {
            echo "Error: " . $e->getMessage();
        }
    }

    /* TODO: Método para eliminar un usuario
     * @param int $id - ID del usuario a eliminar
     * Descripción: Este método elimina un usuario de la base de datos.
     */
    public function delUsuario(int $id)
    {
        if ($this->conect === null) {
            echo "No hay conexión a la base de datos.";
            return null;
        }
        
        try {
            $this->intId = $id;
            $sql = "DELETE FROM usuario WHERE idusuario = :id ";
            $delete = $this->conect->prepare($sql);
            $arrData = array(":id" => $this->intId);
            $del = $delete->execute($arrData);
            return $del;
        } catch (\Throwable $th) {
            echo "Error: " . $th->getMessage();
        }
    }
}