<?php

/* TODO: Controlador para gestionar acciones administrativas del Administrador*/
class AdminController
{
    /* TODO: La propiedad $repo es una instancia de VecinoRepository,
     * encargada de la persistencia y acceso a los datos de los vecinos
     * (leer, crear, modificar, eliminar). Permite desacoplar la lógica de datos del controlador.
     */
    private VecinoRepository $repo;

    /* TODO: Constructor: inicializa el repositorio con la ruta al archivo de datos */
    public function __construct()
    {
        $this->repo = new VecinoRepository(__DIR__ . '/../../../data/vecinos.dat');
    }

    /* TODO: Muestra el dashboard del administrador con la lista de vecinos */
    public function dashboard()
    {
        $vecinos = $this->repo->getAll(); // Obtiene todos los vecinos
        require __DIR__ . '/../Views/admin/dashboardAdmin.php'; // Carga la vista
    }

    /* TODO: Crea un nuevo vecino a partir de los datos enviados por POST */
    public function create()
    {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            /* TODO: Construye el objeto Vecino con los datos del formulario */
            $nuevo = new Vecino([
                'id' => time(), // ID único basado en timestamp
                'username' => $_POST['username'],
                'password' => password_hash($_POST['password'], PASSWORD_DEFAULT), // Encripta la contraseña
                'rol' => 'vecino', // El rol por defecto es 'vecino'
                'nombre' => $_POST['nombre'],
                'apellidos' => $_POST['apellidos'],
                'dni' => $_POST['dni'],
                'telefono' => $_POST['telefono'],
                'email' => $_POST['email'],
                'viviendas' => explode(',', $_POST['viviendas']), // Convierte viviendas en array
                'fecha_alta' => $_POST['fecha_alta'],
                'cuotas_pagadas' => (int)$_POST['cuotas_pagadas'],
                'fecha_ultima_cuota' => $_POST['fecha_ultima_cuota'] ?: null,
                'presidente' => isset($_POST['presidente']) // Booleano si es presidente
            ]);
            $this->repo->create($nuevo); // Guarda el nuevo vecino
            header('Location: index.php?action=dashboardAdmin'); // Redirige al dashboard
            exit;
        }
    }

    /* TODO: Actualiza los datos de un vecino existente */
    public function update()
    {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $vecino = $this->repo->findById((int)$_POST['id']); // Busca el vecino por ID
            if ($vecino) {
                /* TODO: Actualiza los campos del vecino con los datos del formulario */
                $vecino->setNombre($_POST['nombre']);
                $vecino->setApellidos($_POST['apellidos']);
                $vecino->setDni($_POST['dni']);
                $vecino->setTelefono($_POST['telefono']);
                $vecino->setEmail($_POST['email']);
                $vecino->setViviendas(explode(',', $_POST['viviendas']));
                $vecino->setCuotasPagadas((int)$_POST['cuotas_pagadas']);
                $vecino->setFechaUltimaCuota($_POST['fecha_ultima_cuota']);
                $vecino->setPresidente(isset($_POST['presidente']));
                // Recalcular cuotas pendientes según la nueva fecha
                $vecino->setCuotasPendientes($vecino->calcularCuotasPendientes());
                $this->repo->update($vecino); // Guarda los cambios
            }
            header('Location: index.php?action=dashboardAdmin'); // Redirige al dashboard
            exit;
        }
    }

    /* TODO: Elimina un vecino por ID recibido por GET */
    public function delete()
    {
        if (isset($_GET['id'])) {
            $this->repo->delete((int)$_GET['id']); // Elimina el vecino
            header('Location: index.php?action=dashboardAdmin'); // Redirige al dashboard
            exit;
        }
    }
}
