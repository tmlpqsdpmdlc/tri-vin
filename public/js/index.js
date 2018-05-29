// Display the wines in the dom
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

/******************************Page mecanics**********************************/
var couleur = $('#couleur').text()
var containerWidth = $('#container').width()
var dimensions

// Navigate between the tabs and ask for loading the personnal list of wines
$('.tabSousMenu').click(function() {

    $('.tabSousMenu').removeClass('active')
    $(this).addClass('active')

    couleur = tabToCouleurSingulier($('#onglets').find('a').index(this))

    $.post('/listegenerale', {couleur: couleur}, function() {
        $('.loader').show()
    }).done(function( data ) {
        $('.loader').hide()

        // Get in shape the received datas
        $('#liste_des_vins_classes').html(affichageTri(data.liste_des_vins_classes))
        $('#liste_des_vins_classes').ready(function() {
            // Js has a bug, it needs to use setTime Out
            setTimeout(function(){
                $('.imageClassement').each(function() {
                    dimensions = dimensionnerImage($(this).width(), $(this).height(), containerWidth)
                    $(this).css('width', dimensions.largeurImage + 'px').css('height', dimensions.hauteurImage + 'px')
                })
            },10)
        })
    })
})

// Initiate the tabs and simulate a click for starting the ranking display
$(document).ready(function() {
    if (couleur !== 'false') {
        $('.tabSousMenu:nth-child(' + ( couleurSingulierToTab(couleur) + 1 ) + ')').addClass('active').click()
    } else {
        couleur = 'rouge'
        $('.tabSousMenu').first().addClass('active').click()
    }
})

/**********************Dynamic responsive pictures*******************************/
window.onresize = function() {
    containerWidth = $('#container').width()
    setTimeout(function(){
        $('.imageClassement').each(function() {
            dimensions = dimensionnerImage($(this).width(), $(this).height(), containerWidth)
            $(this).css('width', dimensions.largeurImage + 'px').css('height', dimensions.hauteurImage + 'px')
        })
    },10)
}