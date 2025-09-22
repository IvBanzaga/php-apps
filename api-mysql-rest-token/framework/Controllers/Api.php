<?php

class Api extends Controllers
{
    public function __construct()
    {
        parent::__construct();
    }

    public function test()
    {
        $response = [
            'status' => true,
            'message' => 'API funcionando correctamente',
            'data' => [
                'timestamp' => date('Y-m-d H:i:s'),
                'framework' => 'PHP MVC Framework',
                'version' => '1.0'
            ]
        ];

        jsonResponse($response, 200);
        die();
    }

    public function status()
    {
        try {
            $dbStatus = 'desconectado';
            $tablesCount = 0;

            // Verificar si hay modelo disponible
            if ($this->model) {
                // Aquí podrías hacer una consulta simple para verificar la conexión
                $dbStatus = 'conectado';
            }

            $response = [
                'status' => true,
                'message' => 'Estado del sistema',
                'data' => [
                    'php_version' => PHP_VERSION,
                    'framework_status' => 'activo',
                    'database_status' => $dbStatus,
                    'autoload_status' => 'activo',
                    'helpers_status' => function_exists('jsonResponse') ? 'activo' : 'inactivo',
                    'timestamp' => date('Y-m-d H:i:s')
                ]
            ];

            jsonResponse($response, 200);
        } catch (Exception $e) {
            $response = [
                'status' => false,
                'message' => 'Error en el sistema: ' . $e->getMessage()
            ];
            jsonResponse($response, 500);
        }
        die();
    }

    public function info()
    {
        phpinfo();
        die();
    }
}
