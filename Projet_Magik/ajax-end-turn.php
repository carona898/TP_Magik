<?php
    require_once("action/AjaxEndTurnAction.php");

    $action = new AjaxEndTurnAction();
    $data = $action->execute();

    echo json_encode($data["result3"]); //converti les data php en json