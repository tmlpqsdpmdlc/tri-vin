// Display wines in the DOM
function affichageTri(liste_des_vins_classes) {
    let htmlTemporaire = ''
    let retour = '<button class="ui massive positive button insert" classements_personnels_vins="0">Placer ici</button></br>'

    for(var i = 0 ; i < liste_des_vins_classes.length ; i++) {
        htmlTemporaire += '<a href="/ficheVin?id_vins=' + liste_des_vins_classes[i].id_vins + '" class="etiquette"><img class="imageClassement" src="' + liste_des_vins_classes[i].etiquette + '"></a></br>'
        htmlTemporaire += '<button class="ui massive positive button insert" classements_personnels_vins="' + (i + 1) + '">Placer ici</button></br>'
        retour += htmlTemporaire
        htmlTemporaire = ''
    }
    return retour
}

/******************************Page mecanics**********************************/
var id_membre = $('#id_membre').text()
var couleur = $('#couleur').text()
var mode = $('#mode').text()
var id_vins = $('#insertId').text()
var containerWidth = $('#container').width()
var dimensions

// Navigate between the tabs and start the loading of the personnal wine list
$('.tabSousMenu').click(function() {

    $('.tabSousMenu').removeClass('active')
    $(this).addClass('active')

    couleur = tabToCouleurSingulier($('#onglets').find('a').index(this))

    $.post('/listepersonnelle', {id_membre: id_membre, couleur: couleur}, function() {
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

        // Display mode stuff
        // Get the pictures unclickable
        // Get the tabs unclickable
        if (mode === 'insert') {

            // Auto insertion of the first wine of the ranking
            if (data.liste_des_vins_classes.length === 0) {
                mode = 'consultation'
                $.post('/classerpesonnel', {id_membres: id_membre, couleur: couleur, id_vins: id_vins, classements_personnels_vins: 0}, function() {
                    // Send the datas to the server
                }).done(function(data) {
                    $('.active').click()
                })
            }

            $('.insert').show()
            $('.consultation').hide()
            $('.etiquette, .tabSousMenu').css('pointer-events', 'none')
            $('.insert').css('pointer-events', 'auto')
        } else if (mode === 'consultation'){
            $('.insert').hide()
            $('.consultation').show()
            $('.etiquette, .tabSousMenu').css('pointer-events', 'auto')
        } else {
            $('.insert').hide()
            $('.consultation').hide()
            $('.etiquette, .tabSousMenu').css('pointer-events', 'auto')
        }

    })
})

// Insert a wine at the wanted spot and then reload the ranking in consultation mode
$(document).on('click', '.insert', function() {
    let classements_personnels_vins = $(this).attr('classements_personnels_vins')
    mode = 'consultation'

    $.post('/classerpesonnel', {id_membres: id_membre, couleur: couleur, id_vins: id_vins, classements_personnels_vins: classements_personnels_vins}, function() {
        // Send the datas to the server
    }).done(function(data) {
        $('.active').click()
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