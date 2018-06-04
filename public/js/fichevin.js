var url_string = window.location.href
var url = new URL(url_string)
var id_vins = url.searchParams.get('id_vins')
var id_membres = $('#id_membres').text()
var containerWidth
var dimensions

// Hide empty tr when building the page
$('td').click(function() {
    if ($(this).text() === '' || $(this).text() === undefined) {
        $(this).parent().hide()
    }
})

// Search in the db for the wine to display
$(document).ready(function() {
    $('.loader').show()
    $('.fichevin').hide()

    let objectToSend = {id_vins: id_vins, id_membres: 'toto'}

    // differenciate logged in or not
    if (id_membres === false 
        || id_membres === 'false'
        || id_membres === '') {
        objectToSend.id_membres = false
    } else {
        objectToSend.id_membres = id_membres
    }

    $.post('getFicheVin', objectToSend, function() {
        
    }).done(function(data) {
        $('.loader').hide()
        $('.fichevin').show()

        // Display datas
        $('#nom').append(data.nom)
        $('#millesime').append(data.millesime)
        $('#etiquette').attr('src', data.etiquette)
        $('#couleur').append(data.couleur)
        $('#classement_general').append(data.classement_general)
        $('#classements_personnels_vins').append(data.classements_personnels_vins + 1).click()
        $('#commentaire_personnel').append(data.commentaire_personnel).click()
        $('#date_consommation').append(data.date_consommation).click()

        // Waiting for evols
        $('#vignerons').click()
        $('#cepages').click()

        // Js has a bug, it needs to use setTime Out
        setTimeout(function() {
            containerWidth = $('#container').width()
            dimensions = dimensionnerImage($('#etiquette').width(), $('#etiquette').height(), containerWidth)
            $('#etiquette').css('width', dimensions.largeurImage + 'px').css('height', dimensions.hauteurImage + 'px')
        }, 30)
    })
})