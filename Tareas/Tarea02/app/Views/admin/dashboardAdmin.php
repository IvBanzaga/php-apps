<?php

/* TODO: Iniciar sesión si no está iniciada */
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

/* TODO: Redirigir si no es administrador */
if (!isset($_SESSION['usuario']) || $_SESSION['usuario']['rol'] !== 'administrador') {
    header("Location: " . BASE_URL . "index.php");
    exit;
}

/* TODO: Obtener información del usuario y lista de vecinos */
$usuario = $_SESSION['usuario'];
$vecinoRepo = new VecinoRepository(__DIR__ . '/../../../data/vecinos.dat');
$vecinos = $vecinoRepo->getAll();
?>


<h1>Bienvenido Administrador, <?= htmlspecialchars($usuario['username']) ?></h1>
<?php require_once __DIR__ . '/../../../config/routes.php'; ?>
<a href="<?= BASE_URL ?>index.php?action=logout">Cerrar sesión</a>

<h2>Gestión de vecinos</h2>

<!-- TODO: Formulario Administrador -->
<table border="1" cellpadding="5" cellspacing="0">
  <thead>
    <tr>
      <th>ID</th>
      <th>Nombre</th>
      <th>Apellidos</th>
      <th>DNI</th>
      <th>Teléfono</th>
      <th>Email</th>
      <th>Vivienda(s)</th>
      <th>Fecha alta</th>
      <th>Cuotas pagadas</th>
      <th>Cuotas pendientes</th>
      <th>Fecha última cuota</th>
      <th>Presidente</th>
      <th>Acciones</th>
    </tr>
  </thead>
  <tbody>
    <?php foreach ($vecinos as $v): ?>
    <tr>
      <form action="<?= BASE_URL ?>index.php?action=updateVecino" method="post">
        <td><?= $v->getId() ?><input type="hidden" name="id" value="<?= $v->getId() ?>"></td>
        <td><input type="text" name="nombre" value="<?= htmlspecialchars($v->getNombre()) ?>"></td>
        <td><input type="text" name="apellidos" value="<?= htmlspecialchars($v->getApellidos()) ?>"></td>
        <td><input type="text" name="dni" value="<?= htmlspecialchars($v->getDni()) ?>"></td>
        <td><input type="text" name="telefono" value="<?= htmlspecialchars($v->getTelefono()) ?>"></td>
        <td><input type="text" name="email" value="<?= htmlspecialchars($v->getEmail()) ?>"></td>
        <td><input type="text" name="viviendas" value="<?= implode(',', $v->getViviendas()) ?>"></td>
        <td><?= $v->getFechaAlta() ?></td>
        <td><input type="number" name="cuotas_pagadas" value="<?= $v->getCuotasPagadas() ?>"></td>
        <td><?= $v->getCuotasPendientes() ?></td>
        <td><input type="date" name="fecha_ultima_cuota" value="<?= $v->getFechaUltimaCuota() ?>"></td>
        <td><input type="checkbox" name="presidente" <?= $v->getPresidente() ? 'checked' : '' ?>></td>
        <td>
          <button type="submit">Guardar</button>
          <a href="<?= BASE_URL ?>index.php?action=deleteVecino&id=<?= $v->getId() ?>"
            onclick="return confirm('¿Eliminar vecino?')">Eliminar</a>
        </td>
      </form>
    </tr>
    <?php endforeach; ?>
  </tbody>
</table>

<!-- TODO: Formulario de creación de nuevo vecino -->
<h2>Crear nuevo vecino</h2>
<form action="<?= BASE_URL ?>index.php?action=createVecino" method="post">
  <label>Nombre: <input type="text" name="nombre" required></label><br>
  <label>Apellidos: <input type="text" name="apellidos" required></label><br>
  <label>DNI: <input type="text" name="dni" required></label><br>
  <label>Teléfono: <input type="text" name="telefono"></label><br>
  <label>Email: <input type="text" name="email"></label><br>
  <label>Vivienda(s): <input type="text" name="viviendas"></label><br>
  <label>Contraseña: <input type="password" name="password" required></label><br>
  <label>Fecha alta: <input type="date" name="fecha_alta" value="<?= date('Y-m-d') ?>"></label><br>
  <label>Cuotas pagadas: <input type="number" name="cuotas_pagadas" value="0"></label><br>
  <label>Fecha última cuota: <input type="date" name="fecha_ultima_cuota"></label><br>
  <label>Presidente: <input type="checkbox" name="presidente"></label><br>
  <button type="submit">Crear vecino</button>
</form>
