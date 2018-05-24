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
    retour = '<button class="ui massive positive button insert" classements_personnels_vins="0">Placer ici</button></br>'

    for(var i = 0 ; i < liste_des_vins_classes.length ; i++) {
        htmlTemporaire += '<a href="/ficheVin?id=' + liste_des_vins_classes[i].id_vins + '" class="etiquette"><img class="imageClassement" src="' + liste_des_vins_classes[i].etiquette + '"></a></br>'
        htmlTemporaire += '<button class="ui massive positive button insert" classements_personnels_vins="' + (i + 1) + '">Placer ici</button></br>'
        retour += htmlTemporaire
        htmlTemporaire = ""
    }

    return retour
}

/******************************Mécanique de la page**********************************/
var id_membre = $("#id_membre").text()
var couleur = $("#couleur").text()
var mode = $("#mode").text()
var id_vins = $("#insertId").text()
var containerWidth = $("#container").width()
var dimensions

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
        $("#liste_des_vins_classes").ready(function() {
            // JS est buggé il faut passer par cette asutuce
            setTimeout(function(){
                $(".imageClassement").each(function() {
                    dimensions = dimensionnerImage($(this).width(), $(this).height(), containerWidth)
                    $(this).css("width", dimensions.largeurImage + "px").css("height", dimensions.hauteurImage + "px")
                })
            },10)
        })
        
        // Afficher le matériel relatif au mode
        // Rendre les images non clicables
        // Rendre les onglets non clicables
        if (mode === "insert") {

            // Insertion automatique du premier vin au classement
            if (data.liste_des_vins_classes.length === 0) {
                mode = "consultation"
                $.post('/classerpesonnel', {id_membres: id_membre, couleur: couleur, id_vins: id_vins, classements_personnels_vins: 0}, function() {
                    // envoie des données au serveur
                }).done(function( data ) {
                    $('.active').click()
                })
            }

            $(".insert").show()
            $(".consultation").hide()
            $(".etiquette, .tabSousMenu").css('pointer-events', 'none')
            $('.insert').css('pointer-events', 'auto')
        } else if (mode === "consultation"){
            $(".insert").hide()
            $(".consultation").show()
            $(".etiquette, .tabSousMenu").css('pointer-events', 'auto')
        } else {
            $(".insert").hide()
            $(".consultation").hide()
            $(".etiquette, .tabSousMenu").css('pointer-events', 'auto')
        }

    })
})

// Insérer un vin à l'emplacement désiré puis rechargement du classement en mode consultation
$(document).on('click', '.insert', function() {
    let classements_personnels_vins = $(this).attr('classements_personnels_vins')
    mode = "consultation"

    $.post('/classerpesonnel', {id_membres: id_membre, couleur: couleur, id_vins: id_vins, classements_personnels_vins: classements_personnels_vins}, function() {
        // envoie des données au serveur
    }).done(function( data ) {
        $('.active').click()
    })

})

// Initialiser les onglets et simuler un click pour lancer l'affichage du classement
$(document).ready(function() {
    if (couleur !== "false") {
        $(".tabSousMenu:nth-child(" + ( couleurSingulierToTab(couleur) + 1 ) + ")").addClass("active").click()
    } else {
        couleur = "rouge"
        $(".tabSousMenu").first().addClass("active").click()
    }
})

/**********************Images responsive dynamiquement*******************************/
window.onresize = function() {
    containerWidth = $("#container").width()
    setTimeout(function(){
        $(".imageClassement").each(function() {
            dimensions = dimensionnerImage($(this).width(), $(this).height(), containerWidth)
            $(this).css("width", dimensions.largeurImage + "px").css("height", dimensions.hauteurImage + "px")
        })
    },10)
}