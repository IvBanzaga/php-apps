<?php

class TestModel extends Mysql
{
    public function __construct()
    {
        parent::__construct();
    }

    public function test()
    {
        return [
            'status' => 'success',
            'message' => 'TestModel funcionando correctamente',
            'mysql_class' => get_class($this)
        ];
    }
}
