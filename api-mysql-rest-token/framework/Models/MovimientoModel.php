<?php

class MovimientoModel extends Mysql
{
    private $intIdTipoMovimiento;
    private $strMovimiento;
    private $intTipoMovimiento;
    private $strDescTipoMovimiento;

    private $intIdMovimiento;
    private $intCuendaID;
    private $descripcion;
    private $intMonto;
    private $strFecha;

    public function __construct()
    {
        parent::__construct();
    }


    public function setTipoMovimiento(string $movimiento, int $tipomovimiento, string $descripcion)
    {
        $this->strMovimiento = $movimiento;
        $this->intTipoMovimiento = $tipomovimiento;
        $this->strDescTipoMovimiento = $descripcion;

        $sql = "SELECT * FROM tipo_movimiento WHERE movimiento = :mov AND status != 0 ";
        $arrData = array(":mov" => $this->strMovimiento);
        $request = $this->select($sql, $arrData);
        if (empty($request)) {
            $sql_insert = "INSERT INTO tipo_movimiento(movimiento,tipo_movimiento,descripcion)
                                VALUES(:mov,:tipo_mov,:desc)";
            $arrData = array(
                ":mov" => $this->strMovimiento,
                ":tipo_mov" =>  $this->intTipoMovimiento,
                ":desc" => $this->strDescTipoMovimiento
            );
            $request_insert = $this->insert($sql_insert, $arrData);
            return $request_insert;
        } else {
            return false;
        }
    }

    public function getTiposMovimiento()
    {
        $sql = "SELECT idtipomovimiento,movimiento,tipo_movimiento
                    FROM tipo_movimiento WHERE status !=0  ORDER BY idtipomovimiento DESC ";
        $request = $this->select_all($sql);
        return $request;
    }
}
