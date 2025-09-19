<?php
class Conectar
{
    // variables para la conexion a la base de datos

    /** @var PDO Conexión a la base de datos */
    protected PDO $dbh;
    protected $dbhosting = "localhost";
    protected $dbname = "php-api";
    protected $dbuser = "root";
    protected $dbpass = "123456";

    // funcion para establecer la conexion a la base de datos
    protected function Conexion()
    {
        try {
            $conectar = $this->dbh = new PDO("mysql:host={$this->dbhosting};dbname={$this->dbname}", $this->dbuser, $this->dbpass);
            return $conectar;
        } catch (Exception $e) {
            print "!error DB:" . $e->getMessage() . "<br/>";
            die();
        }
    }
    // funcion para establecer el conjunto de caracteres de la conexion
    public function set_name()
    {
        return $this->Conexion()->query("SET NAMES 'utf8'");
    }
}