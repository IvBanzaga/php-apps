<?php

/* TODO: Clase AuthController
 * Descripción: Controlador para la autenticación de usuarios
 */
class AuthController
{
    /* TODO: Cargamos el archivo de usuarios
     * Descripción: Carga los datos de usuarios desde un archivo .dat con formato JSON
     */
    private $usuariosFile = __DIR__ . '/../../data/vecinos.dat';

    /* TODO: Inicio de sesión
     * Descripción: Usamos un Switch para redirigir al dashboard según el rol
     */
    public function login()
    {
        if (isset($_SESSION['usuario'])) {  // Si ya hay una sesión iniciada
            $usuario = $_SESSION['usuario'];// obtenemos los datos del usuario
            switch ($usuario['rol']) {      // y redirigimos al dashboard según su rol
                case 'vecino':
                    include __DIR__ . '/../Views/vecino/dashboardVecino.php';
                    break;
                case 'presidente':
                    include __DIR__ . '/../Views/presidente/dashboardPresidente.php';
                    break;
                case 'administrador':
                    include __DIR__ . '/../Views/admin/dashboardAdmin.php';
                    break;
            }
            exit;
        }

        // Y si no hay sesión iniciada, mostramos el formulario de login
        include __DIR__ . '/../Views/auth/login.php';
    }

    /* TODO: Procesamos el Login
     * Descripción:
     */
    public function doLogin()
    {
        // Variables del formulario
        $username = $_POST['username'] ?? '';
        $password = $_POST['password'] ?? '';

        // Cargar usuarios y verificamos las credenciales
        $usuarios = $this->cargarUsuarios();

        // Recorremos los usuarios para verificar las credenciales
        foreach ($usuarios as $usuario) {
            if ($usuario['username'] === $username && $usuario['password'] === $password) {
                $_SESSION['usuario'] = $usuario;
                $this->login(); // Lo redirige automáticamente al dashboard correspondiente
                return;
            }
        }

        // Si no son correctas, mostramos un mensaje de error y redirigimos al index que a su vez redirige al login
        echo "<p>Credenciales incorrectas</p>";
        echo "<a href='index.php'>Volver al login</a>";
    }

    /* TODO: Función para cargar usuarios
     * Descripción:  Carga los usuarios desde un archivo .dat con formato JSON
     */
    private function cargarUsuarios()
    {
        // Comprobamos si el archivo existe , si no existe devolvemos un array vacío
        if (!file_exists($this->usuariosFile)) return [];

        // Leemos el contenido del archivo, y lo decodificamos de JSON a un array asociativo
        $contenido = file_get_contents($this->usuariosFile);
        $usuarios = json_decode($contenido, true);

        // Devolvemos el array de usuarios, o un array vacío si la decodificación falló
        return is_array($usuarios) ? $usuarios : [];
    }

    /* TODO: Función para cerrar sesión
     * Descripción: Cierra la sesión del usuario
     */
    public function logout()
    {
        /* Nos aseguramos de que la sesión está iniciada */
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }


        /* Limpiar todas las variables de sesión */
        $_SESSION = [];

        /* Eliminamos en la cookie de sesión */
        if (ini_get("session.use_cookies")) { // Si se están usando cookies para la sesión
            $params = session_get_cookie_params();    // obtenemos los parámetros de la cookie
            setcookie(                                // y la eliminamos
                session_name(),                 // nombre de la cookie
                '',                            // valor vacío
                time() - 3600,    // expiración en el pasado
                '/'                             // path raíz (usualmente suficiente)
            );
        }

        /* TODO: Destruir la sesión */
        session_destroy();

        /* TODO: Redirigir al login */
        header("Location: " . BASE_URL . "index.php");
        exit;
    }
}
