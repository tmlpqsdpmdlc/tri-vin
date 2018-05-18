// Fonction pour supprimer les accents
removeAccents = function(str) {
    var accents    = 'ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž';
    var accentsOut = "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
    str = str.split('');
    var strLen = str.length;
    var i, x;
    for (i = 0; i < strLen; i++) {
      if ((x = accents.indexOf(str[i])) != -1) {
        str[i] = accentsOut[x];
      }
    }
    return str.join('');
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

// Naviguer entre les onglets et demander le chargement de la liste personnelle des vins
$(".tabSousMenu").click(function() {

    console.log("click")

    $(".tabSousMenu").removeClass("active")
    $(this).addClass("active")

    $("#classement-personnel").find("h2").first().html("48")

    // getPersonnalListOfTheseWines(couleur, id_membre)
})

// Initialiser les onglets et simuler un click
$(document).ready(function() {
    
    if ($("#couleur").text() !== "false") {
        $(".tabSousMenu:nth-child(" + ( CouleurSingulierToTab($("#couleur").text()) + 1 ) + ")").addClass("active").click()
    } else {
        $(".tabSousMenu").first().addClass("active").click()
    }
})





