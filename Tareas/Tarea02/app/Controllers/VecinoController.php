<?php

/* TODO: Controlador para gestionar acciones de los vecinos */
class VecinoController
{
    private VecinoRepository $vecinoRepo;

    /* TODO: Constructor para inicializar el repositorio de vecinos */
    public function __construct()
    {
        $this->vecinoRepo = new VecinoRepository(__DIR__ . '/../../../data/vecinos.dat');
    }

    /* TODO: Mostrar dashboard vecino */
    public function dashboard(): void
    {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        $usuario = $_SESSION['usuario'] ?? null;
        if (!$usuario || $usuario['rol'] !== 'vecino') {
            header("Location: " . BASE_URL . "index.php");
            exit;
        }

        $vecino = $this->vecinoRepo->findById($usuario['id']);
        require __DIR__ . '/../Views/vecino/dashboardVecino.php';
    }

    /* TODO: Cambio de contraseña del vecion */
    public function updatePassword(): void
    {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        $usuario = $_SESSION['usuario'] ?? null;
        if (!$usuario) {
            header("Location: " . BASE_URL . "index.php");
            exit;
        }

        $vecino = $this->vecinoRepo->findByUsername($usuario['username']);
        $nuevaPassword = $_POST['password'] ?? '';
        if ($vecino && !empty($nuevaPassword)) {
            $vecino->setPassword($nuevaPassword);
            $this->vecinoRepo->update($vecino);
            $_SESSION['usuario']['password'] = $nuevaPassword;
            // Mostrar alert y redirigir con JS
            echo '<script>alert("Contraseña modificada correctamente"); window.location.href = "' . BASE_URL . 'index.php?action=dashboardVecino";</script>';
            exit;
        }

        header("Location: " . BASE_URL . "?action=dashboardVecino");
        exit;
    }
}
