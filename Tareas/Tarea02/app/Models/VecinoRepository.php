<?php

/* TODO: Creamos la clase VecinoRepository para crear las funciones CRUD */
class VecinoRepository
{

    private string $file;

    /* TODO: Constructor para inicializar el archivo de vecinos */
    public function __construct(string $file = 'vecinos.dat')
    {
        /* Ignoramos $file y usamos siempre la ruta absoluta real */
        $ruta = dirname(__DIR__, 2) . '/data/vecinos.dat';
        $resolved = realpath($ruta);
        if ($resolved === false) {
            $resolved = $ruta;
        }
        $this->file = $resolved;
    }

    /* TODO: Leer todos los vecinos */
    public function getAll(): array
    {
        if (!file_exists($this->file)) {
            return [];
        }

        $json = file_get_contents($this->file);
        $data = json_decode($json, true) ?? [];
        return array_map(fn($item) => new Vecino($item), $data);
    }

    /* TODO: Buscar vecino por username */
    public function findByUsername(string $username): ?Vecino
    {
        foreach ($this->getAll() as $v) {
            if ($v->getUsername() === $username) {
                return $v;
            }
        }
        return null;
    }

    /* TODO: Guardar lista de vecinos */
    private function saveAll(array $vecinos): void
    {
        $data = array_map(fn($v) => $v->toArray(), $vecinos);
        file_put_contents($this->file, json_encode($data, JSON_PRETTY_PRINT));
    }

    /* TODO: Buscar vecino por ID */
    public function findById(int $id): ?Vecino
    {
        foreach ($this->getAll() as $v) {
            if ($v->getId() == $id) {
                return $v;
            }
        }
        return null;
    }

    /* TODO: Crear un nuevo vecino */
    public function create(Vecino $vecino): void
    {
        $vecinos = $this->getAll();
        $vecinos[] = $vecino;
        $this->saveAll($vecinos);
    }

    /* TODO: Actualizar todos los campos de un vecino existente */
    public function update(Vecino $vecino): bool
    {
        $vecinos = $this->getAll();
        foreach ($vecinos as $i => $v) {
            if ($v->getId() === $vecino->getId()) {
                $vecinos[$i] = $vecino;
                $this->saveAll($vecinos);
                return true;
            }
        }
        return false;
    }

    /* TODO: Eliminar un vecino */
    public function delete(int $id): bool
    {
        $vecinos = $this->getAll();
        $nuevaLista = array_filter($vecinos, fn($v) => $v->getId() !== $id);

        if (count($vecinos) === count($nuevaLista)) {
            return false; // No se eliminó
        }

        $this->saveAll($nuevaLista);
        return true;
    }
}
