<?php

class CuentaModel extends Mysql
{
    private $intIdCuenta;
    private $strNombreCuenta;
    private $strNumeroCuenta;
    private $strTipoCuenta;
    private $strBanco;
    private $floatSaldo;
    private $intStatus;

    public function __construct()
    {
        parent::__construct();
    }


    public function setCuenta(string $nombre_cuenta, string $numero_cuenta, string $tipo_cuenta, string $banco, float $saldo)
    {
        $this->strNombreCuenta = $nombre_cuenta;
        $this->strNumeroCuenta = $numero_cuenta;
        $this->strTipoCuenta = $tipo_cuenta;
        $this->strBanco = $banco;
        $this->floatSaldo = $saldo;

        $sql = "INSERT INTO cuenta(nombre_cuenta, numero_cuenta, tipo_cuenta, banco, saldo)
                        VALUES (:nombre, :numero, :tipo, :banco, :saldo)";
        $arrData = array(
            ":nombre" => $this->strNombreCuenta,
            ":numero" => $this->strNumeroCuenta,
            ":tipo" => $this->strTipoCuenta,
            ":banco" => $this->strBanco,
            ":saldo" => $this->floatSaldo
        );
        $request_insert = $this->insert($sql, $arrData);
        return $request_insert;
    }


    public function getCuenta(int $idcuenta)
    {
        $this->intIdCuenta = $idcuenta;
        $sql = "SELECT idcuenta, nombre_cuenta, numero_cuenta, tipo_cuenta, banco, saldo,
                    DATE_FORMAT(fecharegistro, '%d-%m-%Y') as fechaRegistro
                    FROM cuenta
                    WHERE idcuenta = :idcuenta AND status != 0";
        $arrData = array(":idcuenta" => $this->intIdCuenta);
        $request = $this->select($sql, $arrData);
        return $request;
    }


    public function getCuentas()
    {
        $sql = "SELECT idcuenta, nombre_cuenta, numero_cuenta, tipo_cuenta, banco, saldo,
                    DATE_FORMAT(fecharegistro, '%d-%m-%Y') as fechaRegistro
                    FROM cuenta
                    WHERE status != 0 ORDER BY idcuenta DESC ";
        $request = $this->select_all($sql);
        return $request;
    }


    public function updateCuenta(int $idcuenta, string $nombre_cuenta, string $numero_cuenta, string $tipo_cuenta, string $banco, float $saldo)
    {
        $this->intIdCuenta = $idcuenta;
        $this->strNombreCuenta = $nombre_cuenta;
        $this->strNumeroCuenta = $numero_cuenta;
        $this->strTipoCuenta = $tipo_cuenta;
        $this->strBanco = $banco;
        $this->floatSaldo = $saldo;

        $sql = "UPDATE cuenta SET nombre_cuenta = :nombre, numero_cuenta = :numero, tipo_cuenta = :tipo,
                banco = :banco, saldo = :saldo
                WHERE idcuenta = :id";
        $arrData = array(
            ":nombre" => $this->strNombreCuenta,
            ":numero" => $this->strNumeroCuenta,
            ":tipo" => $this->strTipoCuenta,
            ":banco" => $this->strBanco,
            ":saldo" => $this->floatSaldo,
            ":id" => $this->intIdCuenta
        );
        $request = $this->update($sql, $arrData);
        return $request;
    }


    public function deleteCuenta(int $idcuenta)
    {
        $this->intIdCuenta = $idcuenta;
        $sql = "UPDATE cuenta SET status = 0 WHERE idcuenta = :id";
        $arrData = array(":id" => $this->intIdCuenta);
        $request = $this->update($sql, $arrData);
        return $request;
    }

    public function getMovimientos(int $idcuenta)
    {
        $this->intIdCuenta = $idcuenta;
        $sql = "SELECT m.idmovimiento, m.descripcion, m.monto, m.fecha,
                    tm.movimiento as tipo_movimiento,
                    DATE_FORMAT(m.fecharegistro, '%d-%m-%Y') as fechaRegistro
                    FROM movimiento m
                    INNER JOIN tipo_movimiento tm ON m.tipo_movimiento_id = tm.idtipomovimiento
                    WHERE m.cuenta_id = :idcuenta AND m.status != 0
                    ORDER BY m.fecha DESC";
        $arrData = array(":idcuenta" => $this->intIdCuenta);
        $request = $this->select($sql, $arrData);
        return $request;
    }
}