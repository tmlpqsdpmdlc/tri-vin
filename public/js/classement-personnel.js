/******************************Fonctions*****************************************/
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
couleurSingulierToTab = function(couleur) {
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

// Afficher les vins dans le DOM
affichageTri = function(liste_des_vins_classes) {
    htmlTemporaire = ""
    retour = '<p class="insert" id="insert_0">insert</p>'

    for(var i = 0 ; i < liste_des_vins_classes.length ; i++) {

        console.log(liste_des_vins_classes)

        htmlTemporaire += '<a href="/ficheVin?id=' + liste_des_vins_classes[i].id_vins + '" class="etiquette"><img src="' + liste_des_vins_classes[i].etiquette + '"></a></br>'
        htmlTemporaire += '<p class="insert" id="insert_' + (i + 1) + '">insert</p>'
        retour += htmlTemporaire
        htmlTemporaire = ""
    }

    return retour
}

/******************************Mécanique de la page**********************************/
var id_membre = $("#id_membre").text()
var couleur = $("#couleur").text()
var mode = $("#mode").text()

// Naviguer entre les onglets et demander le chargement de la liste personnelle des vins
$(".tabSousMenu").click(function() {

    $(".tabSousMenu").removeClass("active")
    $(this).addClass("active")

    couleur = tabToCouleurSingulier($("#onglets").find("a").index(this))

    // getPersonnalListOfTheseWines (async)
    $.post('/listepersonnelle', {id_membre: id_membre, couleur: couleur}, function() {
        $(".loader").show()
    }).done(function( data ) {
        $(".loader").hide()

        // Mettre en forme les données reçues
        $("#liste_des_vins_classes").html(affichageTri(data.liste_des_vins_classes))

        // Afficher le matériel relatif au mode
        // Rendre les images non clicables
        // Rendre les onglets non clicables
        if (mode === "insert") {
            $(".insert").show()
            $(".etiquette, .tabSousMenu").css('pointer-events', 'none')
        } else {
            $(".insert").hide()
            $(".etiquette, .tabSousMenu").css('pointer-events', 'auto')
        }

    })
})


$(document).ready(function() {
    // Initialiser les onglets et simuler un click pour lancer l'affichage du classement
    if (couleur !== "false") {
        $(".tabSousMenu:nth-child(" + ( couleurSingulierToTab(couleur) + 1 ) + ")").addClass("active").click()
    } else {
        couleur = "rouge"
        $(".tabSousMenu").first().addClass("active").click()
    }
})

