<?php

/* TODO: Iniciar sesión si no está iniciada */
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

/* TODO: Redirigir si no es administrador */
if (!isset($_SESSION['usuario']) || $_SESSION['usuario']['rol'] !== 'vecino') {
    header("Location: " . BASE_URL . "index.php");
    exit;
}

/* TODO: Obtener información del usuario y lista de vecinos */
$usuario = $_SESSION['usuario'];
$vecinoRepo = new VecinoRepository(__DIR__ . '/../../../data/vecinos.dat');
$vecino = $vecinoRepo->findByUsername($usuario['username']);
?>

<h1>Bienvenido Vecino, <?= htmlspecialchars($vecino->getUsername()) ?></h1>
<a href="<?= BASE_URL ?>index.php?action=logout">Cerrar sesión</a>

<h2>Mis datos</h2>

<!-- TODO: Formulario Vecinos -->
<ul>
  <li>Nombre: <?= htmlspecialchars($vecino->getNombre()) ?></li>
  <li>Apellidos: <?= htmlspecialchars($vecino->getApellidos()) ?></li>
  <li>DNI: <?= htmlspecialchars($vecino->getDni()) ?></li>
  <li>Teléfono: <?= htmlspecialchars($vecino->getTelefono() ?? '-') ?></li>
  <li>Email: <?= htmlspecialchars($vecino->getEmail()) ?></li>
  <li>Vivienda(s): <?= implode(', ', $vecino->getViviendas()) ?></li>
  <li>Fecha alta: <?= $vecino->getFechaAlta() ?></li>
  <li>Cuotas pagadas: <?= $vecino->getCuotasPagadas() ?></li>
  <li>Cuotas pendientes: <?= $vecino->getCuotasPendientes() ?></li>
  <li>Fecha última cuota: <?= $vecino->getFechaUltimaCuota() ?? '-' ?></li>
</ul>

<!-- TODO: Formulario Cambiar Contraseña -->
<h2>Cambiar contraseña</h2>
<form action="<?= BASE_URL ?>index.php?action=updatePassword" method="post">
  <label>Nueva contraseña: <input type="password" name="password" required></label><br>
  <button type="submit">Actualizar contraseña</button>
</form>
