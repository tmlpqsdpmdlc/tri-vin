function validerFormulaire() {
    var nom = document.getElementById('nom')
    var millesime = document.getElementById('millesime')
    var couleur = document.getElementById('couleur')
    var date_consommation = document.getElementById('date_consommation')
    var etiquette = document.getElementById('etiquette')
    var commentaire_personnel = document.getElementById('commentaire_personnel')
    var displayImage = document.getElementById('displayImage')
    var erreur = ''

    if (nom.value === '' || nom.value === undefined)
    {
        erreur += 'Le nom est obligatoire. '
    }
    if (millesime.value === '' 
    || millesime.value === undefined
    || millesime.value <1800
    || (new Date()).getFullYear() < millesime.value)
    {
        erreur += 'Le millésime est obligatoire et compris entre 1800 et l\'année actuelle. '
    }
    if (date_consommation.value === '' || date_consommation.value === undefined) 
    {
        erreur += 'La date de consommation du vin est obligatoire même si elle est approximative. '
    }
    if (displayImage.src === '' || displayImage.src === undefined) 
    {
        erreur += 'Il faut ajouter une photo de l\'étiquette du vin. '
    }

    if (erreur === undefined || erreur === '')
    {
        $('#partie-formulaire').hide()
        $('#loader').show()
        document.getElementById('insertion-vin').submit()
    }
    else
    {
        alert(erreur)
    }
}