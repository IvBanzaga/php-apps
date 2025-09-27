<?php
/* TODO: Iniciar sesión si no está iniciada */
if (session_status() === PHP_SESSION_NONE) session_start();

/* TODO: Redirigir si no es administrador */
if (!isset($_SESSION['usuario']) || $_SESSION['usuario']['rol'] !== 'presidente') {
    header("Location: " . BASE_URL . "index.php");
    exit;
}

/* TODO: Obtener información del usuario y lista de vecinos */
$usuario = $_SESSION['usuario'];
$vecinoRepo = new VecinoRepository(__DIR__ . '/../../../data/vecinos.dat');
$vecinos = $vecinoRepo->getAll();
?>

<h1>Bienvenido Presidente, <?= htmlspecialchars($usuario['username']) ?></h1>
<a href="<?= BASE_URL ?>index.php?action=logout">Cerrar sesión</a>

<h2>Gestión de cuotas</h2>

<!-- TODO: Formulario Presidente -->
<table border="1" cellpadding="5" cellspacing="0">
  <thead>
    <tr>
      <th>ID</th>
      <th>Nombre</th>
      <th>Apellidos</th>
      <th>DNI</th>
      <th>Cuotas pagadas</th>
      <th>Cuotas pendientes</th>
      <th>Fecha última cuota</th>
      <th>Acciones</th>
    </tr>
  </thead>
  <tbody>
    <?php foreach ($vecinos as $v): ?>
    <tr>
      <form action="<?= BASE_URL ?>index.php?action=updateCuotasPresidente" method="post">
        <td><?= $v->getId() ?><input type="hidden" name="id" value="<?= $v->getId() ?>"></td>
        <td><?= htmlspecialchars($v->getNombre()) ?></td>
        <td><?= htmlspecialchars($v->getApellidos()) ?></td>
        <td><?= htmlspecialchars($v->getDni()) ?></td>
        <td><input type="number" name="cuotas_pagadas" value="<?= $v->getCuotasPagadas() ?>"></td>
        <td><?= $v->getCuotasPendientes() ?></td>
        <td><input type="date" name="fecha_ultima_cuota" value="<?= $v->getFechaUltimaCuota() ?>"></td>
        <td><button type="submit">Actualizar</button></td>
      </form>
    </tr>
    <?php endforeach; ?>
  </tbody>
</table>
