<?php
class AuthController
{
    private $usuariosFile = __DIR__ . '/../../data/usuarios.dat';

    public function login()
    {
        if (isset($_SESSION['usuario'])) {
            $usuario = $_SESSION['usuario'];
            // Redirige al dashboard según rol
            switch ($usuario['rol']) {
                case 'vecino':
                    include __DIR__ . '/../Views/vecino/dashboardVecino.php';
                    break;
                case 'presidente':
                    include __DIR__ . '/../Views/presidente/dashboardPresidende.php';
                    break;
                case 'administrador':
                    include __DIR__ . '/../Views/admin/dashboardAdmin.php';
                    break;
            }
            exit;
        }

        include __DIR__ . '/../Views/auth/login.php';
    }

    public function doLogin()
    {
        $username = $_POST['username'] ?? '';
        $password = $_POST['password'] ?? '';

        $usuarios = $this->cargarUsuarios();

        foreach ($usuarios as $usuario) {
            if ($usuario['username'] === $username && $usuario['password'] === $password) {
                $_SESSION['usuario'] = $usuario;
                $this->login(); // redirige automáticamente
                return;
            }
        }

        echo "<p>Credenciales incorrectas</p>";
        echo "<a href='index.php'>Volver al login</a>";
    }

    private function cargarUsuarios()
    {
        if (!file_exists($this->usuariosFile)) return [];

        $contenido = file_get_contents($this->usuariosFile);
        $usuarios = json_decode($contenido, true);

        return is_array($usuarios) ? $usuarios : [];
    }

    public function logout()
    {
        // Asegurarse de que la sesión está iniciada
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        // Limpiar todas las variables de sesión
        $_SESSION = [];

        // Eliminar la cookie de sesión
        if (ini_get("session.use_cookies")) {
            $params = session_get_cookie_params();
            setcookie(
                session_name(),
                '',
                time() - 42000,
                $params["path"],
                $params["domain"],
                $params["secure"],
                $params["httponly"]
            );
        }

        // Destruir la sesión
        session_destroy();

        // Redirigir al login
        header("Location: " . BASE_URL . "index.php");
        exit;
    }
}