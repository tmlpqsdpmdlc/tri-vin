var url_string = window.location.href
var url = new URL(url_string)
var id_vins = url.searchParams.get('id_vins')
var id_membres = $('#id_membres').text()
var containerWidth
var dimensions

// On va masquer les tr vides lors de la construction de la page
$('td').click(function() {
    if ($(this).text() === '' || $(this).text() === undefined) {
        $(this).parent().hide()
    }
})

// On va chercher dans la base le vin à afficher
$(document).ready(function() {
    let objectToSend = {id_vins: id_vins, id_membres: 'toto'}

    // on différencie le cas connecté et déconnecté
    if (id_membres === false 
        || id_membres === 'false'
        || id_membres === '') {
        objectToSend.id_membres = false
    } else {
        objectToSend.id_membres = id_membres
    }

    $.post('getFicheVin', objectToSend, function() {
        $('.loader').show()
        $('.fichevin').hide()
    }).done(function(data) {
        $('.loader').hide()
        $('.fichevin').show()

        // Restitution des données
        $('#nom').append(data.nom)
        $('#millesime').append(data.millesime)
        $('#etiquette').attr('src', data.etiquette)
        $('#couleur').append(data.couleur)
        $('#classement_general').append(data.classement_general)
        $('#classements_personnels_vins').append(data.classements_personnels_vins + 1).click()
        $('#commentaire_personnel').append(data.commentaire_personnel).click()
        $('#date_consommation').append(data.date_consommation).click()

        // En attendant de les implémenter, on les prépare
        $('#vignerons').click()
        $('#cepages').click()

        // JS est buggé, il faut utiliser l'astuce du setTimeout pour utiliser la fct dimensionnerImage
        setTimeout(function() {
            containerWidth = $('#container').width()
            dimensions = dimensionnerImage($('#etiquette').width(), $('#etiquette').height(), containerWidth)
            $('#etiquette').css('width', dimensions.largeurImage + 'px').css('height', dimensions.hauteurImage + 'px')
        }, 10)
    })
})