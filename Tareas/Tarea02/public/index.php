<?php

/* TODO: Página principal del sistema de autenticación
 * Descripción: Manejo de login, logout y dashboards por rol
 */

/* TODO: Inicializar sesión en todo el proyecto */
session_start();

/* TODO: Autoload y rutas */
require __DIR__ . '/../autoload.php';
require __DIR__ . '/../config/routes.php';

/* TODO: Inicializar los controladores */
$authController = new AuthController();
$adminController = new AdminController();
$presidenteController = new PresidenteController();
$vecinoController = new VecinoController();

/* TODO: Obtener la acción solicitada por el usuario desde la URL, o usar la acción por defecto si no se especifica */
$action = $_GET['action'] ?? $config_default_action;

/* TODO: Definimos las acciones de los Roles */
$adminActions      = ['createVecino', 'updateVecino', 'deleteVecino', 'dashboardAdmin'];
$presidenteActions = ['updateCuotasPresidente', 'dashboardPresidente'];
$vecinoActions     = ['updatePassword', 'dashboardVecino'];

/* TODO: Acciones del Administrador */
if (in_array($action, $adminActions)) {
    if (!isset($_SESSION['usuario']) || $_SESSION['usuario']['rol'] !== 'administrador') {
        header("Location: " . BASE_URL . "index.php");
        exit;
    }

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        if ($action === 'createVecino') $adminController->create();
        if ($action === 'updateVecino') $adminController->update();
        if ($action === 'deleteVecino') $adminController->delete();
    }

    if ($action === 'dashboardAdmin') {
        $adminController->dashboard();
    }
    exit;
}

/* TODO: Acciones del Presidente */
if (in_array($action, $presidenteActions)) {
    if (!isset($_SESSION['usuario']) || $_SESSION['usuario']['rol'] !== 'presidente') {
        header("Location: " . BASE_URL . "index.php");
        exit;
    }

    /* POST: actualizar cuotas y fecha */
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        if ($action === 'updateCuotasPresidente') {
            $presidenteController->updateCuotasPresidente();
        }
    }

    /* GET: mostrar dashboard */
    if ($action === 'dashboardPresidente') {
        $presidenteController->dashboard(); // muestra la vista, no header
        exit; // aseguramos que no siga ejecutando nada después
    }
}



/* TODO: Acciones del Vecino */
if (in_array($action, $vecinoActions)) {
    if (!isset($_SESSION['usuario']) || $_SESSION['usuario']['rol'] !== 'vecino') {
        header("Location: " . BASE_URL . "index.php");
        exit;
    }

    if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'updatePassword') {
        $vecinoController->updatePassword();
    }

    if ($action === 'dashboardVecino') $vecinoController->dashboard();
    exit;
}

/* TODO: LOGIN/LOGOUT */
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $authController->doLogin();
} elseif ($action === 'logout') {
    $authController->logout();
} else {
    $authController->login();
}
