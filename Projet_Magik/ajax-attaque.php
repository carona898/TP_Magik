<?php
    require_once("action/AjaxCarteAttaqueAction.php");

    $action = new AjaxCarteAttaqueAction();
    $data = $action->execute();

    echo json_encode($data["result3"]); //converti les data php en json