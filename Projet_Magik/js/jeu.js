let sizeAdv = 0;
let boardAdv = 0;
let boardPl = 0;
let sizePlay = 0;
let dataG = null
let attaquer = false;
let carteActionUID = null;
let chatAfficher = false;



const state = () => {
    fetch("ajax-state.php", {   // Il faut créer cette page et son contrôleur appelle 
        method : "POST"        // l’API (games/state)
    })
    .then(response => response.json())
    .then(data => {
        
        if(data == "LAST_GAME_WON" || data == "LAST_GAME_LOST"){

            delCarteAdv();
            delCartePlay();
            let partieTerm = document.getElementById("partieTermine");
            let text = document.getElementById("text");
            partieTerm.style.display = "block";
            partieTerm.style.fontSize = "x-large";

            if(data == "LAST_GAME_WON"){
                text.innerHTML = "VOUS AVEZ GAGNE!"
            }
            else if(data == "LAST_GAME_LOST"){
                
                text.innerHTML =("VOUS AVEZ PERDU!!"); 
            }
        }
        if (typeof data !== "object") {
            if(data != null){
                let update = document.getElementById("erreur");
                update.innerHTML = data;  
            }  
        }
        console.log(data); // contient les cartes/état du jeu.
        dataG = data;
        gameUpdate(data);
        
        setTimeout(state, 1000); // Attendre 1 seconde avant de relancer l’appel
    })
}

window.addEventListener("load", () => {

setTimeout(state, 1000); // Appel initial (attendre 1 seconde)

});

const gameUpdate = data => {

    if(data.hand != null){
        let classH = document.getElementById("classH");
        let vie = document.getElementById("vie");
        let temps = document.getElementById("temps");
        let magie = document.getElementById("magie");
        let nbCarte = document.getElementById("nbCarte");
        let endturn = document.getElementById("boutonA");
        let endPartie = document.getElementById("boutonB");
        let bchat = document.getElementById("boutonChat");

        classH.firstChild.innerHTML = data.heroClass + "\n";
        classH.firstChild.innerHTML += "\n";
        classH.firstChild.innerHTML += "my turn:" + data.yourTurn;
        vie.firstChild.innerHTML = "VIE: " + data.hp;
        temps.firstChild.innerHTML = "TEMPS: " + data.remainingTurnTime;
        magie.firstChild.innerHTML = "MP: " + data.mp;
        nbCarte.firstChild.innerHTML = "CARTES: " + data.remainingCardsCount;

        endturn.innerHTML = "END TURN";
        nbCarte.style.verticalAlign = "center";

        //pour le hero power
        classH.onclick = heroPower
        
        function heroPower(){
            fetch("ajax-heroPower.php", {})
            .then(response => response.json())
            .then(data => {
                if (typeof data !== "object") {
                    if(data != null){
                        let update = document.getElementById("erreur");
                        update.innerHTML = data;  
                    }  
                }
                console.log(data);
            })
        };

        //pour terminer un tour
        endturn.onclick = terminerTour;
        
        function terminerTour(){   
            fetch("ajax-end-turn.php", {})
            .then(response => response.json())
            .then(data => {
                if (typeof data !== "object") {
                    if(data != null){
                        let update = document.getElementById("erreur");
                        update.innerHTML = data;  
                    }  
                }
                console.log(data);
               
            })
        };

        //pour abandonner une partie
        endPartie.onclick = abandonnePartie;

        function abandonnePartie(){
            fetch("ajax-end-game.php", {})
            .then(response => response.json())
            .then(data => {
                console.log(data);
                window.location="loby.php";
            })
        };

        //pour le chat
        bchat.onclick = chatOn;
        
        function chatOn(){
            let chat = document.getElementById("chatGame");
            if(!chatAfficher){
                chat.style.opacity = 1;
                chatAfficher = true;
            }
            else if(chatAfficher){
                chat.style.opacity = 0;
                chatAfficher = false;
            }
        };


        //afficher les cates du joueur
        //if(data.hand.length != sizePlay){
            let carte = document.getElementById("grid-container");
            while (carte.hasChildNodes()) { //enlever tous les enfants
                carte.removeChild(carte.lastChild);
            }

            data.hand.forEach(element => {

                let newDiv = document.createElement("div");
                newDiv.className = "grid-item";

                let newImage = document.createElement("div");
                newImage.className = "imageCarte";

                
                newImage.style.backgroundSize = "cover";
                newImage.style.backgroundRepeat = "no-repeat";
                newImage.style.backgroundPosition = "center center";
                newImage.style.backgroundImage = "url('./images/image_carte/" + element.id + ".png')";
                
                newDiv.appendChild(newImage);

                let newP = document.createElement("p");
                newP.className = "infoCarte";
                newP.textContent = "atk: " + element.atk;
                newP.style.position = "fixed";
                newP.style.top = 20+"%";

                let newP1 = document.createElement("p");
                newP1.className = "infoCarte";
                newP1.textContent = "cost: " + element.cost;
                newP1.style.position = "fixed";
                newP1.style.top = 30+"%";
                
                let newP2 = document.createElement("p");
                newP2.className = "infoCarte";
                newP2.textContent = "hp: " + element.hp;
                newP2.style.position = "fixed";
                newP2.style.top = 40+"%";

                let newP3 = document.createElement("p");
                newP3.className = "infoCarte";
                newP3.textContent = "mechanics: " + element.mechanics;
                

                newDiv.append(newP, newP1, newP2, newP3);

                if(element.mechanics.includes("Taunt")){
                    newDiv.style.boxShadow = "0 0 60px 30px #fcffa4"
                }
                else if(element.mechanics.includes("Stealth")){
                    newDiv.style.boxShadow = "0 0 60px 30px #1385ee"
                }
                else if(element.mechanics.includes("Charge")){
                    newDiv.style.boxShadow = "0 0 60px 30px #f00"
                }
                //function pour jouer une carte lorsque c'est notre tour
                newDiv.onclick = jouerCarte;
                
                function jouerCarte(){
                    let formdata = new FormData();
                    formdata.append("uid", element.uid)
                    fetch("ajax-carte.php", {
                        method: "post",
                        body: formdata
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (typeof data !== "object") {
                            if(data != null){
                                let update = document.getElementById("erreur");
                                update.innerHTML = data;  
                            }
                        }
                        else{
                            data.mp -= element.cost;
                            console.log("Carte joue");
                            //pour comptabiliser le nbr de fois qu'une carte est joue, pour les stats
                             let formdata = new FormData();
                             formdata.append("id", element.id);
                             formdata.append("count", 1);
                             fetch("ajax-carte-count.php", {
                                 method: "post",
                                 body: formdata
                             })
                             .then(response => response.json())
                             .then(data => {
                    
                                 console.log("hello");
                                 console.log(data);
                             })
                            refreshCartePlay();
                        }
                    })          
                };

                carte.prepend(newDiv);                
            });

        //}
        //sizePlay = data.hand.length;

        // afficher les infos adverses
        
        let infoAN = document.getElementById("infoAN");
        let infoAHp = document.getElementById("infoAHp");
        let infoACa = document.getElementById("infoACa");
        let infoAMp = document.getElementById("infoAMp");

        
        infoAN.textContent = "Name: " + data.opponent.username;
        infoAHp.textContent = "Hp: " + data.opponent.hp;
        infoACa.textContent = "Remaining Card: " + data.opponent.remainingCardsCount;
        infoAMp.textContent = "Mp: " + data.opponent.mp;


        infoAN.onclick = attaquerAdv;
        
        function attaquerAdv(){ //faire verification si les cartes ADV on taunt
            // if(attaquer){
                let formdata = new FormData();
                formdata.append("uidAdv", 0);
                formdata.append("uidPlay", carteActionUID);

                fetch("ajax-attaque.php", {
                    method: "post",
                    body: formdata
                })
                .then(response => response.json())
                .then(data => {
                    if (typeof data !== "object") {
                        let update = document.getElementById("erreur");
                        update.innerHTML = data;  
                    }
                    else{
                        attaquer = false;
                        carteActionUID = null;
                    }
                    console.log(data);
                })  
            // }
        };
       
        // console.log(data.opponent);

        if(data.opponent.handSize != sizeAdv){

            let mainAdv = document.getElementById("carteAdv");
            while (mainAdv.hasChildNodes()) { //enlever tous les enfants
                mainAdv.removeChild(mainAdv.lastChild);
            }

            for(let i = 0; i < data.opponent.handSize; i++){
                
                let newDiv = document.createElement("div");
                newDiv.className = "carteA";
                mainAdv.prepend(newDiv);
            }
        }
        sizeAdv = data.opponent.handSize;

        //pour l'affichage du board de l'adversaire
        //if(data.opponent.board.length != boardAdv){
        refreshCarteAdv(); 
        //}

        //boardAdv = data.opponent.board.length;


        //pour afficher le board du joueur

        //if(data.board.length != boardPl){
        refreshCartePlay();
        //}

        //boardPl = data.opponent.board.length;
    }



    function refreshCartePlay() {
        
        let boardJ = document.getElementById("jeuPlayer");
        while (boardJ.hasChildNodes()) { //enlever tous les enfants
            boardJ.removeChild(boardJ.lastChild);
        }
        //faire boucle wile, creer les cartes

        data.board.forEach(element => {

            let newDiv = document.createElement("div");
            newDiv.className = "carteABoard";

            let newImage = document.createElement("div");
            newImage.className = "imageCarte";
            newImage.style.backgroundSize = "cover";
            newImage.style.backgroundRepeat = "no-repeat";
            newImage.style.backgroundPosition = "center center";
            newImage.style.backgroundImage = "url('./images/image_carte/" + element.id + ".png')";
            
            newDiv.appendChild(newImage);

            let newP = document.createElement("p");
            newP.className = "infoCarte";
            newP.textContent = "atk: " + element.atk;
            newP.style.position = "relative";
            newP.style.top = 0+"%";

            //let newP1 = document.createElement("p");
            //newP1.className = "infoCarte";
            //newP1.textContent = "cost: " + element.cost;
            //newP1.style.position = "relative";
            //newP1.style.top = 0+"%";

            let newP2 = document.createElement("p");
            newP2.className = "infoCarte";
            newP2.textContent = "hp: " + element.hp;
            newP2.style.position = "relative";
            newP2.style.top = 0+"%";

            let newP3 = document.createElement("p");
            newP3.className = "infoCarte";
            newP3.textContent = "mechanics: " + element.mechanics;
    
            newDiv.append(newP, newP2, newP3);

            if(element.state == "IDLE"){
                newDiv.style.opacity = 1;
            }
            else if(element.state == "SLEEP"){
                newDiv.style.opacity = 0.5;
            }

            if(element.mechanics.includes("Taunt")){
                newDiv.style.boxShadow = "0 0 60px 30px #fcffa4"
            }
            else if(element.mechanics.includes("Stealth")){
                newDiv.style.boxShadow = "0 0 60px 30px #1385ee"
            }
            else if(element.mechanics.includes("Charge")){
                newDiv.style.boxShadow = "0 0 60px 30px #f00"
            }

            //pour attaquer hero adv
            newDiv.onclick = attaqueHero;
            
            function attaqueHero(){
                data.mp -= element.cost;
                if(element.state != "SLEEP"){
                    attaquer = true;  
                    carteActionUID = element.uid;          
                }
            };

            boardJ.prepend(newDiv);                
        });

        boardPl = data.opponent.board.length;
    }

    function refreshCarteAdv() {
 
        let boardA = document.getElementById("jeuAdv");
        while (boardA.hasChildNodes()) { //enlever tous les enfants
            boardA.removeChild(boardA.lastChild);
        }
        //faire boucle wile, creer les cartes

        data.opponent.board.forEach(element => {

            let newDiv = document.createElement("div");
            newDiv.className = "carteABoard";

            let newImage = document.createElement("div");
            newImage.className = "imageCarte";
            newImage.style.backgroundSize = "cover";
            newImage.style.backgroundRepeat = "no-repeat";
            newImage.style.backgroundPosition = "center center";
            newImage.style.backgroundImage = "url('./images/image_carte/" + element.id + ".png')";
            
            newDiv.appendChild(newImage);

            let newP = document.createElement("p");
            newP.className = "infoCarte";
            newP.textContent = "atk: " + element.atk;
            newP.style.position = "relative";
            newP.style.top = 0+"%";

            //let newP1 = document.createElement("p");
            //newP1.className = "infoCarte";
            //newP1.textContent = "cost: " + element.cost;
            //newP1.style.position = "relative";
            //newP1.style.top = 0+"%";

            let newP2 = document.createElement("p");
            newP2.className = "infoCarte";
            newP2.textContent = "hp: " + element.hp;
            newP2.style.position = "relative";
            newP2.style.top = 0+"%";

            let newP3 = document.createElement("p");
            newP3.className = "infoCarte";
            newP3.textContent = "mechanics: " + element.mechanics;
    
            newDiv.append(newP, newP2, newP3);

            if(element.state == "IDLE"){
                newDiv.style.opacity = 1;
            }
            else if(element.state == "SLEEP"){
                newDiv.style.opacity = 0.5;
            }

            if(element.mechanics.includes("Taunt")){
                newDiv.style.boxShadow = "0 0 60px 30px #fcffa4"
            }
            else if(element.mechanics.includes("Stealth")){
                newDiv.style.boxShadow = "0 0 60px 30px #1385ee"
            }
            else if(element.mechanics.includes("Charge")){
                newDiv.style.boxShadow = "0 0 60px 30px #f00"
            }

            //selectionner une carte pour faire une action
            newDiv.onclick = choisirCarte;

            function choisirCarte(){
                // if(!(element.mechanics.includes("Stealth"))){
                    // if(attaquer){
                        let formdata = new FormData();
                        formdata.append("uidAdv", element.uid);
                        formdata.append("uidPlay", carteActionUID);

                        fetch("ajax-attaque.php", {
                            method: "post",
                            body: formdata
                        })
                        .then(response => response.json())
                        .then(data => {
                            if (typeof data !== "object") {
                                if(data != null){
                                    let update = document.getElementById("erreur");
                                    update.innerHTML = data;  
                                }  
                            }
                            else{
                                attaquer = false;
                                carteActionUID = null;
                            }
                            console.log(data);
                        })
                        refreshCarteAdv();
                    // }
                // }
            };
            boardA.prepend(newDiv);                
        });
        boardAdv = data.opponent.board.length;
    }

}

function delCarteAdv(){
    let boardA = document.getElementById("jeuAdv");
        while (boardA.hasChildNodes()) { //enlever tous les enfants
            boardA.removeChild(boardA.lastChild);
        }
    boardA.remove();
}

function delCartePlay(){
    let boardJ = document.getElementById("jeuPlayer");
    while (boardJ.hasChildNodes()) { //enlever tous les enfants
        boardJ.removeChild(boardJ.lastChild);
    }
    boardJ.remove()
}














