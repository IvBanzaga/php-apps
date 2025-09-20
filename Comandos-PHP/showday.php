<?php
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="css/style.css">
    <title>Document</title>
</head>
<body>
    
</body>
</html>
<?php
if (isset($_POST["day"]))
{
    $day = $_POST["day"];
    $number = 5;
    $bool = false;
    $price = 25.5;
    echo "<h3>El tipo de la variable day es: " , var_dump($day) . "</h3>";
    echo "<h3>El tipo de la variable number es: " , var_dump($number) . "</h3>";
    echo "<h3>El tipo de la variable bool es: " , var_dump($bool) . "</h3>";
    echo "<h3>El tipo de la variable price es: " , var_dump($price) . "</h3>";

    switch($day)
    {
        case 1:
            echo "<h3>Lunes</h3>";
            break;
        case 2:
            echo "<h3>Martes</h3>";
            break;
        case 3:
            echo "<h3>Miércoles</h3>";
            break;
        case 4:
            echo "<h3>Jueves</h3>";
            break;
        case 5:
            echo "<h3>Viernes</h3>";
            break;
        case 6:
            echo "<h3>Sábado</h3>";
            break;
        case 7:
            echo "<h3>Domingo</h3>";
            break;
        default:
        echo "<h3>El Numero Ingresado no es un Día Valido.</h3>";
    }

    $i = 1;
    while ($i <= 13)
    {
        if ($i == 13)
        {
            echo $i;
            break;
        }
        else
        {
            echo $i++ . ", ";
        }
    }

    echo "<br><br>";
    $i = 1;
    while ($i <= 13)
    {
        echo "<h3>" . ++$i . "</h3>";
    }

    echo "<br><br>";
    $i = 1;

    while ($i <= 13)
    {
        if ($i == 13)
        {
            echo "<font size=6 color=red>$i</font>";
            break;
        }
        else
        {
            echo "<font size=6 color=red>$i</font>, ";
            $i++;
        }
    }

    $i = 1;

    while ($i <= 13)
    {
        echo "<h1 class='size'>$i</h1>";
        $i++;
    }
}
?>