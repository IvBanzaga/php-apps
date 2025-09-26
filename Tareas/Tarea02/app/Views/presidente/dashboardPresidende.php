<?php

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (!isset($_SESSION['usuario'])) {
    header("Location: " . BASE_URL . "index.php");
    exit;
}

$usuario = $_SESSION['usuario'];
?>

<h1>Bienvenido Presidente, <?= htmlspecialchars($usuario['username']) ?> (<?= htmlspecialchars($usuario['rol']) ?>)
</h1>
<?php require_once __DIR__ . '/../../../config/routes.php'; ?>
<a href="<?= BASE_URL ?>index.php?action=logout">Cerrar sesión</a>
