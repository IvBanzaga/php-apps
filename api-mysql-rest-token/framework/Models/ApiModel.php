<?php

class ApiModel extends Mysql
{
    public function __construct()
    {
        parent::__construct();
    }

    public function testConnection()
    {
        try {
            $sql = "SELECT 1 as test";
            $result = $this->select_all($sql);
            return $result !== null;
        } catch (Exception $e) {
            return false;
        }
    }

    public function getTableCount()
    {
        try {
            $sql = "SHOW TABLES";
            $result = $this->select_all($sql);
            return $result ? count($result) : 0;
        } catch (Exception $e) {
            return 0;
        }
    }
}
