<?php

/* TODO: Clase que representa a un vecino */
class Vecino {
    private int $id;
    private string $username;
    private string $password;
    private string $rol;
    private string $nombre;
    private string $apellidos;
    private string $dni;
    private ?string $telefono;
    private string $email;
    private array $viviendas;
    private string $fecha_alta;
    private int $cuotas_pagadas;
    private int $cuotas_pendientes;
    private ?string $fecha_ultima_cuota;
    private bool $presidente;

    // Usaremos ?? para asignar valores por defecto si no existen en el vecino.dat
    public function __construct(array $data)
    {
        $this->id = $data['id'] ?? 0;
        $this->username = $data['username'] ?? '';
        $this->password = $data['password'] ?? '';
        $this->rol = $data['rol'] ?? 'vecino';
        $this->nombre = $data['nombre'] ?? '';
        $this->apellidos = $data['apellidos'] ?? '';
        $this->dni = $data['dni'] ?? '';
        $this->telefono = $data['telefono'] ?? null;
        $this->email = $data['email'] ?? '';
        $this->viviendas = $data['viviendas'] ?? [];
        $this->fecha_alta = $data['fecha_alta'] ?? date("Y-m-d");
        $this->cuotas_pagadas = $data['cuotas_pagadas'] ?? 0;
        $this->cuotas_pendientes = $data['cuotas_pendientes'] ?? 0;
        $this->fecha_ultima_cuota = $data['fecha_ultima_cuota'] ?? null;
        $this->presidente = $data['presidente'] ?? false;
    }

    /* TODO: Implementar el método toArray
     * Descripción: Convierte el objeto Vecino en un array asociativo para guardarlo en JSON
     * Retorno: array asociativo con los datos del vecino
     * Ejemplo:
     * ['id' => 1, 'username' => 'juan', 'password' => 'hashed_pw', ... ]
    */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'username' => $this->username,
            'password' => $this->password,
            'rol' => $this->rol,
            'nombre' => $this->nombre,
            'apellidos' => $this->apellidos,
            'dni' => $this->dni,
            'telefono' => $this->telefono,
            'email' => $this->email,
            'viviendas' => $this->viviendas,
            'fecha_alta' => $this->fecha_alta,
            'cuotas_pagadas' => $this->cuotas_pagadas,
            'cuotas_pendientes' => $this->cuotas_pendientes,
            'fecha_ultima_cuota' => $this->fecha_ultima_cuota,
            'presidente' => $this->presidente
        ];
    }

    /* TODO: Implementar el método fromJson para crear un Vecino a partir de un JSON */
    public static function fromJson(string $json): Vecino
    {
        $data = json_decode($json, true);
        return new Vecino($data);
    }

    /* TODO: Método para calcular las cuotas pendientes
     * Descripción: Calcula las cuotas pendientes basándose en la fecha de la última cuota
     * Retorno: número de cuotas pendientes (int)
     * Descripción: Este método calcula el número de cuotas que están pendientes de pago
     * Descripción: Si no hay fecha de última cuota, devuelve 0
     * Descripción: Calcula la diferencia en meses entre la fecha actual y la última cuota
     */
    public function calcularCuotasPendientes(): int
    {
        if (!$this->fecha_ultima_cuota) return 0;

        $ultima = new DateTime($this->fecha_ultima_cuota);
        $hoy = new DateTime('first day of this month');
        $meses = (($hoy->format('Y') - $ultima->format('Y')) * 12) + ($hoy->format('m') - $ultima->format('m'));

        return max(0, $meses);
    }



    /* TODO: Métodos getters para ver la información */
    public function getId() {
        return $this->id;
    }

    public function getUsername() {
        return $this->username;
    }

    public function getPassword() {
        return $this->password;
    }

    public function getRol() {
        return $this->rol;
    }

    public function getNombre() {
        return $this->nombre;
    }

    public function getApellidos() {
        return $this->apellidos;
    }

    public function getDni() {
        return $this->dni;
    }

    public function getTelefono() {
        return $this->telefono;
    }

    public function getEmail() {
        return $this->email;
    }

    public function getViviendas() {
        return $this->viviendas;
    }

    public function getFechaAlta() {
        return $this->fecha_alta;
    }

    public function getCuotasPagadas() {
        return $this->cuotas_pagadas;
    }

    public function getCuotasPendientes() {
        return $this->cuotas_pendientes;
    }

    public function getFechaUltimaCuota() {
        return $this->fecha_ultima_cuota;
    }

    public function getPresidente() {
        return $this->presidente;
    }

    /* TODO: Métodos setters para modificar la información */
    public function setUsername($username) {
        $this->username = $username;
    }

    public function setPassword($password) {
        $this->password = $password;
    }

    public function setRol($rol) {
        $this->rol = $rol;
    }

    public function setNombre($nombre) {
        $this->nombre = $nombre;
    }

    public function setApellidos($apellidos) {
        $this->apellidos = $apellidos;
    }

    public function setDni($dni) {
        $this->dni = $dni;
    }

    public function setTelefono($telefono) {
        $this->telefono = $telefono;
    }

    public function setEmail($email) {
        $this->email = $email;
    }

    public function setViviendas($viviendas) {
        $this->viviendas = $viviendas;
    }

    public function setFechaAlta($fecha_alta) {
        $this->fecha_alta = $fecha_alta;
    }

    public function setCuotasPagadas($cuotas_pagadas) {
        $this->cuotas_pagadas = $cuotas_pagadas;
    }

    public function setCuotasPendientes($cuotas_pendientes) {
        $this->cuotas_pendientes = $cuotas_pendientes;
    }

    public function setFechaUltimaCuota($fecha_ultima_cuota) {
        $this->fecha_ultima_cuota = $fecha_ultima_cuota;
    }

    public function setPresidente($presidente) {
        $this->presidente = $presidente;
    }
}
