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
    var classementPersonnel = document.getElementById("classement-personnel")
    var titre = classementPersonnel.getElementsByTagName("h2")[0]
    
    titre.innerHTML = "Affichage du classement personnel des vins " + tabToCouleurPlurielle(tab)

    // liste de tous les vins
    //getListOfTheseWines(tab)
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

// Obtenir la couleur au singulier depuis le numéro de l'onglet
tabToCouleurPlurielle = function(tab) {
    if (tab === 0) {
        return "rouges"
    }
    if (tab === 1) {
        return "blancs"
    }
    if (tab === 2) {
        return "rosés"
    }
}

// Obtenir le numéro de l'onglet depuis la couleur au singulier
CouleurSingulierToTab = function(couleur) {
    if (couleur === "false" || couleur === "rouge") {
        return 0
    }
    if (couleur === "blanc") {
        return 1
    }
    if (couleur === "rose") {
        return 2
    }
}

// On coche le bon onglet avec la couleur qu'on reçoit de l'insertion
// Si pas de couleur, on choisit rouge
setActive(CouleurSingulierToTab(couleur))
