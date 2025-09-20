<?php
if (isset($_POST["month"]))
{
    $month = $_POST["month"];

    switch($month)
    {
        case 1:
            echo "<h3>Enero</h3>";
            break;
        case 2:
            echo "<h3>Febrero</h3>";
            break;
        case 3:
            echo "<h3>Marzo</h3>";
            break;
        case 4:
            echo "<h3>Abril</h3>";
            break;
        case 5:
            echo "<h3>Mayo</h3>";
            break;
        case 6:
            echo "<h3>Junio</h3>";
            break;
        case 7:
            echo "<h3>Julio</h3>";
            break;
        case 8:
            echo "<h3>Agosto</h3>";
            break;
        case 9:
            echo "<h3>Septiembre</h3>";
            break;
        case 10:
            echo "<h3>Octubre</h3>";
            break;
        case 11:
            echo "<h3>Noviembre</h3>";
            break;
        case 12:
            echo "<h3>Diciembre</h3>";
            break;
        default:
        echo "<h3>El Mes no es Valido</h3>";
    }
}
?>