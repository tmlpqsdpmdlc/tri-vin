var url_string = window.location.href
var url = new URL(url_string)
var id_vins = url.searchParams.get("id_vins")
var id_membres = $("#id_membres").text()

// On va chercher dans la base le vin à afficher
$(document).ready(function() {
    let objectToSend = {id_vins: id_vins, id_membres: 'toto'}

    // on différencie le cas connecté et déconnecté
    if (id_membres === false 
        || id_membres === "false"
        || id_membres === "") {
            objectToSend.id_membres = false
    } else {
        objectToSend.id_membres = id_membres
    }

    $.post('getFicheVin', objectToSend, function() {
        $(".loader").show()
        $(".fichevin").hide()
    }).done(function(data) {
        $(".loader").hide()
        $(".fichevin").show()

        console.log(data)

    })
})