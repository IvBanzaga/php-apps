<?php
class Movimiento extends Controllers
{

    public function __construct()
    {
        parent::__construct();
    }

    public function registroTipoMovimiento()
    {
        try {
            $method = $_SERVER['REQUEST_METHOD'];
            $response = [];
            if ($method == "POST") {
                $_POST = json_decode(file_get_contents('php://input'), true);
                if (empty($_POST['movimiento'])) {
                    $response = array('status' => false, 'msg' => 'El movimiento es requerido');
                    jsonResponse($response, 200);
                    die();
                }
                if (empty($_POST['tipo_movimiento']) or ($_POST['tipo_movimiento'] != 1 and $_POST['tipo_movimiento'] != 2)) {
                    $response = array('status' => false, 'msg' => 'Error en el Tipo Movimiento');
                    jsonResponse($response, 200);
                    die();
                }
                if (empty($_POST['descripcion'])) {
                    $response = array('status' => false, 'msg' => 'La descripcion es requerida');
                    jsonResponse($response, 200);
                    die();
                }

                $strMovimiento = ucwords(strClean($_POST['movimiento']));
                $intTipoMovimiento = $_POST['tipo_movimiento'];
                $strDescripcion = strClean($_POST['descripcion']);

                if ($this->model === null) {
                    $response = array('status' => false, 'msg' => 'Error interno: Modelo no cargado');
                    jsonResponse($response, 500);
                    die();
                }

                $request = $this->model->setTipoMovimiento($strMovimiento, $intTipoMovimiento, $strDescripcion);
                if ($request > 0) {
                    $arrMovimiento = array(
                        "idtipomovimiento" => $request,
                        "movimiento" =>  $strMovimiento,
                        "tipo_movimiento" => $intTipoMovimiento,
                        "descripcion" => $strDescripcion
                    );
                    $response = array('status' => true, 'msg' => 'Datos guardados correctamente', 'data' => $arrMovimiento);
                } else {
                    $response = array('status' => false, 'msg' => 'El tipo movimiento ya existe');
                }
                $code = 200;
            } else {
                $response = array('status' => false, 'msg' => 'Error en la solicitud ' . $method);
                $code = 400;
            }
            jsonResponse($response, $code);
            die();
        } catch (Exception $e) {
            echo "Error en el proceso: " . $e->getMessage();
        }
        die();
    }


    public function tiposMovimiento()
    {
        try {
            $method = $_SERVER['REQUEST_METHOD'];
            $response = [];
            if ($method == "GET") {
                if ($this->model === null) {
                    $response = array('status' => false, 'msg' => 'Error interno: Modelo no cargado');
                    jsonResponse($response, 500);
                    die();
                }

                $arrData = $this->model->getTiposMovimiento();
                if (empty($arrData)) {
                    $response = array('status' => true, 'msg' => 'No hay datos para mostrar', 'data' => "");
                } else {
                    $response = array('status' => true, 'msg' => 'Datos encontrados', 'data' => $arrData);
                }
                $code = 200;
            } else {
                $response = array('status' => false, 'msg' => 'Error en la solicitud ' . $method);
                $code = 400;
            }
            jsonResponse($response, $code);
            die();
        } catch (Exception $e) {
            echo "Error en el proceso: " . $e->getMessage();
        }
        die();
    }
}
