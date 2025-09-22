<?php

echo "=== Prueba de la API REST ===\n\n";

// Test 1: Probar si el autoload funciona
echo "Test 1: Probando Autoload...\n";
require_once("framework/Autoload.php");
echo "✓ Autoload cargado\n\n";

// Test 2: Probar configuración
echo "Test 2: Probando configuración...\n";
require_once("framework/Config/Config.php");
echo "✓ BASE_URL: " . BASE_URL . "\n";
echo "✓ DB_HOST: " . DB_HOST . "\n";
echo "✓ DB_NAME: " . DB_NAME . "\n\n";

// Test 3: Probar helpers
echo "Test 3: Probando helpers...\n";
require_once("framework/Helpers/Helpers.php");
echo "✓ Helpers cargados\n\n";

// Test 4: Probar conexión a base de datos
echo "Test 4: Probando conexión a base de datos...\n";
try {
    $conexion = new Conexion();
    echo "✓ Clase Conexion instanciada\n";
} catch (Exception $e) {
    echo "✗ Error en conexión: " . $e->getMessage() . "\n";
}

// Test 5: Probar clase Mysql
echo "\nTest 5: Probando clase Mysql...\n";
try {
    $mysql = new Mysql();
    echo "✓ Clase Mysql instanciada\n";
} catch (Exception $e) {
    echo "✗ Error en Mysql: " . $e->getMessage() . "\n";
}

// Test 6: Probar controlador Test
echo "\nTest 6: Probando controlador Test...\n";
try {
    $test = new Test();
    echo "✓ Controlador Test instanciado\n";
    echo "✓ Modelo en controlador: " . ($test->model ? get_class($test->model) : 'null') . "\n";
} catch (Exception $e) {
    echo "✗ Error en controlador Test: " . $e->getMessage() . "\n";
}

echo "\n=== Fin de las pruebas ===\n";
