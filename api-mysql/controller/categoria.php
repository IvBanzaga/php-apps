<?php

// Configuración de la cabecera
header('Content-Type: application/json');

// incluimos la conexion a la base de datos y el modelo de Categoria
require_once("../config/conexion.php");
require_once("../models/Categoria.php");

// creamos un objeto de la clase Categoria
$categoria = new Categoria();

// obtenemos los datos que se envian por el metodo POST
$body = json_decode(file_get_contents("php://input"), true);


// realizamos las operaciones segun la opcion que se envia
switch ($_GET["op"]) {

  case "GetAll":
    $datos = $categoria->get_categoria();
    echo json_encode($datos);
    break;

  case "GetId":

    $datos = $categoria->get_categoria_x_id($body["cat_id"]);
    echo json_encode($datos);

    break;


  case "insert":

    $datos = $categoria->insert_categoria($body["cat_nom"], $body["cat_obs"]);
    echo json_encode("insertado correctamente");

    break;

  case "update":

    $datos = $categoria->update_categoria($body["cat_id"], $body["cat_nom"], $body["cat_obs"]);
    echo json_encode("categoria actualizada correctamente");

    break;

  case "delete":

    $datos = $categoria->delete_categoria($body["cat_id"]);
    echo json_encode("categoria desactivada correctamente");

    break;
}