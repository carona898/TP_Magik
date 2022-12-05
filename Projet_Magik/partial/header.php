<!DOCTYPE html>
<html  lang="fr">
    <head>
        <title><?=$pageTitre?></title>
        <meta charset="utf-8">
        <link rel="stylesheet" href="css/global.css">
        <?php
            if($pageTitre == "Magik_acceuil"){
                ?>
                    <script src="js/acceuil.js"></script>
                    <script src="js/TiltedImage.js"></script>
                <?php
            }
        ?>
        <?php
            if($pageTitre == "pageDeck"){
                ?>
                    <script src="js/deck.js"></script>
                <?php
            }
        ?>
        <?php
            if($pageTitre == "Loby"){
                ?>
                    <script src="js/javascript.js"></script>
                <?php
            }
        ?>
        <?php
            if($pageTitre == "Stats"){
                ?>
                    <script src="js/stats.js"></script>
                <?php
            }
        ?>
        <?php
            if($pageTitre == "Training" || $pageTitre == "PVP" ){
                ?>
                    <script src="js/jeu.js"></script>
                    <script src="js/shenron.js"></script>
                    <script src="js/feu.js"></script>
                <?php
            }
        ?>
    </head>
    <body>
        <?php

            if(!($pageTitre == "Training" || $pageTitre == "PVP" || $pageTitre == "Magik_acceuil")){
                if($data["isConnected"] > 0){
                ?>
                    <div id="menu">
                        <p style="font-size:25px"><?= "BIENVENUE " . $_SESSION["username"]  ?></p>
                        <ul>
                            <li><a href="loby.php">Loby</a></li>
                            <li><a href="pageDeck.php">PageDeck</a></li>
                            <li><a href="stats.php">Stats</a></li>
                            <li><a href="?logout=true">Deconnexion</a></li>
                            <li><a href="jeu.php?pvp=false">Training</a></li>
                            <li><a href="jeu.php?pvp=true">PVP</a></li>
                        </ul>
                    </div>
                <?php
                }
            }

        ?>
    
  