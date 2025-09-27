<?php

/* TODO: Controlador para gestionar acciones del Presidente */
class PresidenteController
{
    private VecinoRepository $repo;

    /* TODO: Constructor para inicializar el repositorio de vecinos */
    public function __construct()
    {
        $this->repo = new VecinoRepository(__DIR__ . '/../../../data/vecinos.dat');
    }

    /* TODO: Mostramos el dashboard del presidente */
    public function dashboard(): void
    {
        $vecinos = $this->repo->getAll(); // Obtener todos los vecinos
        require __DIR__ . '/../Views/presidente/dashboardPresidente.php';
    }

    /* TODO: Actualizamos las cuotas pagas y fecha ultima cuota */
    public function updateCuotasPresidente(): void
    {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            if (isset($_POST['id'])) {
                $id = (int)$_POST['id'];
                $vecino = $this->repo->findById($id);
                if ($vecino) {
                    $cuotas = isset($_POST['cuotas_pagadas']) ? (int)$_POST['cuotas_pagadas'] : null;
                    $fecha = $_POST['fecha_ultima_cuota'] ?? null;
                    $vecino->setCuotasPagadas($cuotas);
                    $vecino->setFechaUltimaCuota($fecha);
                    // Recalcular cuotas pendientes según la nueva fecha
                    $vecino->setCuotasPendientes($vecino->calcularCuotasPendientes());
                    $this->repo->update($vecino);
                }
            }
        }
        header('Location: index.php?action=dashboardPresidente');
        exit;
    }
}
