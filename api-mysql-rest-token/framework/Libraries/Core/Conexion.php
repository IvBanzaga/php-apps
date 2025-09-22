<?php

class Conexion
{
    protected $conect;

    public function __construct()
    {
        if (CONNECTION) {
            try {
                $connectionString = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
                $this->conect = new PDO($connectionString, DB_USER, DB_PASSWORD);
                $this->conect->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            } catch (PDOException $e) {
                $this->conect = null;
                echo "ERROR: " . $e->getMessage();
            }
        }
    }

    public function getConnection()
    {
        return $this->conect;
    }
}
