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

// Obtenir la couleur au singulier depuis le numéro de l'onglet
tabToCouleurSingulier = function(tab) {
    if (tab === 0) {
        return "rouge"
    }
    if (tab === 1) {
        return "blanc"
    }
    if (tab === 2) {
        return "rose"
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

/******************************Mécanique de la page**********************************/
var id_membre = $("#id_membre").text()
var couleur = $("#couleur").text()

// Naviguer entre les onglets et demander le chargement de la liste personnelle des vins
$(".tabSousMenu").click(function() {

    $(".tabSousMenu").removeClass("active")
    $(this).addClass("active")

    couleur = tabToCouleurSingulier($("#onglets").find("a").index(this))
    $("#classement-personnel").find("h2").first().html("48")

    // getPersonnalListOfTheseWines (async)
    $.post('/listepersonnelle', {id_membre: id_membre, couleur: couleur}, function() {
        $(".loader").show()
    }).done(function( data ) {
        $(".loader").hide()

        // Attendre un objet de l'api ajax
        console.log('liste_des_vins_classes', data.liste_des_vins_classes )
    })
})

// Initialiser les onglets et simuler un click
$(document).ready(function() {
    if (couleur !== "false") {
        $(".tabSousMenu:nth-child(" + ( CouleurSingulierToTab(couleur) + 1 ) + ")").addClass("active").click()
    } else {
        couleur = "rouge"
        $(".tabSousMenu").first().addClass("active").click()
    }
})

