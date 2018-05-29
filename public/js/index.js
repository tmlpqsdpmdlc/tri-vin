// Afficher les vins dans le DOM
function affichageTri(liste_des_vins_classes) {
    let htmlTemporaire = ''
    let retour = ''
    for(var i = 0 ; i < liste_des_vins_classes.length ; i++) {
        htmlTemporaire += '<a href="/ficheVin?id_vins=' + liste_des_vins_classes[i].id_vins + '" class="etiquette"><img class="imageClassement" src="' + liste_des_vins_classes[i].etiquette + '"></a></br>'
        retour += htmlTemporaire
        htmlTemporaire = ''
    }
    return retour
}

/******************************Mécanique de la page**********************************/
var couleur = $('#couleur').text()
var containerWidth = $('#container').width()
var dimensions

// Naviguer entre les onglets et demander le chargement de la liste personnelle des vins
$('.tabSousMenu').click(function() {

    $('.tabSousMenu').removeClass('active')
    $(this).addClass('active')

    couleur = tabToCouleurSingulier($('#onglets').find('a').index(this))

    // getListOfTheseWines (async)
    $.post('/listegenerale', {couleur: couleur}, function() {
        $('.loader').show()
    }).done(function( data ) {
        $('.loader').hide()

        // Mettre en forme les données reçues
        $('#liste_des_vins_classes').html(affichageTri(data.liste_des_vins_classes))
        $('#liste_des_vins_classes').ready(function() {
            // JS est buggé il faut passer par cette asutuce
            setTimeout(function(){
                $('.imageClassement').each(function() {
                    dimensions = dimensionnerImage($(this).width(), $(this).height(), containerWidth)
                    $(this).css('width', dimensions.largeurImage + 'px').css('height', dimensions.hauteurImage + 'px')
                })
            },10)
        })
    })
})

// Initialiser les onglets et simuler un click pour lancer l'affichage du classement
$(document).ready(function() {
    if (couleur !== 'false') {
        $('.tabSousMenu:nth-child(' + ( couleurSingulierToTab(couleur) + 1 ) + ')').addClass('active').click()
    } else {
        couleur = 'rouge'
        $('.tabSousMenu').first().addClass('active').click()
    }
})

/**********************Images responsive dynamiquement*******************************/
window.onresize = function() {
    containerWidth = $('#container').width()
    setTimeout(function(){
        $('.imageClassement').each(function() {
            dimensions = dimensionnerImage($(this).width(), $(this).height(), containerWidth)
            $(this).css('width', dimensions.largeurImage + 'px').css('height', dimensions.hauteurImage + 'px')
        })
    },10)
}