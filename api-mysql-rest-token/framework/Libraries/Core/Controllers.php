<?php

class Controllers
{
    public $views;
    public $model;
    public function __construct()
    {
        $this->views = new Views();
        $this->loadModel();
    }

    public function loadModel()
    {
        $model = get_class($this) . "Model";
        $routClass = __DIR__ . "/../../Models/" . $model . ".php";

        // Debug: Verificar si el archivo existe
        if (file_exists($routClass)) {
            require_once($routClass);
            if (class_exists($model)) {
                $this->model = new $model();
            } else {
                error_log("Clase $model no encontrada después de incluir $routClass");
            }
        } else {
            error_log("Archivo $routClass no encontrado para el modelo $model");
        }
    }
}
