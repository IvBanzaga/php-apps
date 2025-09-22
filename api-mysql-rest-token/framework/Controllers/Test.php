<?php

class Test extends Controllers
{
    public function __construct()
    {
        parent::__construct();
    }

    public function index()
    {
        if ($this->model === null) {
            jsonResponse([
                'status' => 'error',
                'message' => 'Modelo no cargado',
                'debug' => 'TestModel no encontrado o no se pudo instanciar'
            ], 500);
        } else {
            $result = $this->model->test();
            jsonResponse([
                'status' => 'success',
                'message' => 'Modelo cargado correctamente',
                'model_class' => get_class($this->model),
                'test_result' => $result
            ], 200);
        }
    }

    public function info()
    {
        jsonResponse([
            'status' => 'success',
            'message' => 'Test controller funcionando',
            'autoload' => 'OK',
            'controller' => get_class($this),
            'model_status' => $this->model ? 'loaded' : 'null'
        ], 200);
    }
}
