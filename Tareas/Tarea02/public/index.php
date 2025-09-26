<?php
session_start();
require __DIR__ . '/../autoload.php';
require __DIR__ . '/../config/routes.php';

$controller = new AuthController();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $controller->doLogin();
} elseif (isset($_GET['action']) && $_GET['action'] === 'logout') {
    $controller->logout();
} else {
    $controller->login();
}