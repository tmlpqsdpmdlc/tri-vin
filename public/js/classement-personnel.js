// Modification de l'affichage du menu
var tabSousMenu = document.getElementsByClassName('tabSousMenu')
var couleur = document.getElementById("couleur").innerHTML

for(let i = 0 ; i < tabSousMenu.length ; i++)
{
    tabSousMenu[i].addEventListener('click', (event)=>{
        setActive(i)
    })
}

// Quel est l'onglet actif ?
getActive = function() {
    console.log("getActive")
    for(var i = 0 ; i < tabSousMenu.length ; i++)
    {
        if (tabSousMenu[i].getAttribute('class').contains("active")) {
            return i;
        }
    }
}

// Aller chercher en bdd les vins correspondant à l'onglet
montrerClassement = function(tab) {
    console.log("montrerClassement")
    let couleurActuelle = ""
    var classementPersonnel = document.getElementById("classement-personnel")
    var titre = classementPersonnel.getElementsByTagName("h2")[0]
    if (tab === 0) {
        couleurActuelle = "rouges"
    }
    if (tab === 1) {
        couleurActuelle = "blancs"
    }
    if (tab === 2) {
        couleurActuelle = "rosés"
    }
    titre.innerHTML = "Affichage du classement personnel des vins " + couleurActuelle

    /*

    code ici

    */
}

// Afficher le bon onglet et les bons vins
setActive = function(tab)
{
    console.log("setActive")
    for(var i = 0 ; i < tabSousMenu.length ; i++)
    {
        tabSousMenu[i].setAttribute('class', 'item tabSousMenu') 
    }

    tabSousMenu[tab].setAttribute('class', 'item active tabSousMenu')
    montrerClassement(tab)
}

// On coche le bon onglet avec la couleur qu'on reçoit de l'insertion
// Si pas de couleur, on choisit rouge
if (couleur === "false" || couleur === "rouge") {
    setActive(0)
}
if (couleur === "blanc") {
    setActive(1)
}
if (couleur === "rose") {
    setActive(2)
}