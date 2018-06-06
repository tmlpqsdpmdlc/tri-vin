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

/**********************Handling the inputs**********************/
$(document).ready(function(){
    $('#couleur').val($('#couleurCachee').text())
    // Get the name of the wine in uppercase and without accents
    $('#nom').keyup(function(){
        $(this).val(upperCase(removeAccents($(this).val())))
    })
})

// Handle the max date of the date input
var today = new Date()
var dd = today.getDate()
var mm = today.getMonth()+1
var yyyy = today.getFullYear()
if (dd<10)
{
    dd='0'+dd
} 
if (mm<10)
{
    mm='0'+mm
} 

today = yyyy+'-'+mm+'-'+dd
document.getElementById('date_consommation').setAttribute('max', today)

// Display the user image
var loadFile = (event) => {
    var displayImage = document.getElementById('displayImage')
    var containerWidth = document.getElementById('container').clientWidth

    // Reset style in case of there is a new image
    displayImage.style = ''

    displayImage.onload = function() {
        var largeurImage = displayImage.width
        var hauteurImage = displayImage.height
        var dimensionsImage = dimensionnerImage(largeurImage, hauteurImage, containerWidth)
        displayImage.style = 'width: ' + dimensionsImage.largeurImage + 'px; height: ' + dimensionsImage.hauteurImage + 'px; display: block;'
    }
    displayImage.src = URL.createObjectURL(event.target.files[0])
}