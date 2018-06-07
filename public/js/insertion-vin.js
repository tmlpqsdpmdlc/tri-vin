var containerWidth
var largeurImage
var hauteurImage
var dimensionsImage
var canvas
var context
var img
var fd
var extensionImage

// Convert a canvas to a file
function postCanvasToURL(canvas) {
    // Convert canvas image to Base64
    // Convert Base64 image to binary
    return dataURItoBlob(canvas.toDataURL())
}

function dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString
    if (dataURI.split(',')[0].indexOf('base64') >= 0) {
        byteString = atob(dataURI.split(',')[1])
    } else {
        byteString = unescape(dataURI.split(',')[1])
    }
    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length)
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i)
    }
    return new Blob([ia], {type:mimeString})
}


// Check if the form is valid and submit it
function validerFormulaire() {
    var nom = document.getElementById('nom')
    var millesime = document.getElementById('millesime')
    var couleur = document.getElementById('couleur')
    var date_consommation = document.getElementById('date_consommation')
    var etiquette = document.getElementById('etiquette')
    var commentaire_personnel = document.getElementById('commentaire_personnel')
    var displayImage = document.getElementById('displayImage')
    var erreur = ''
    var request

    if (nom.value === '' || nom.value === undefined) {
        erreur += 'Le nom est obligatoire. '
    }
    if (millesime.value === '' 
    || millesime.value === undefined
    || millesime.value <1800
    || (new Date()).getFullYear() < millesime.value) {
        erreur += 'Le millésime est obligatoire et compris entre 1800 et l\'année actuelle. '
    }
    if (date_consommation.value === '' || date_consommation.value === undefined) {
        erreur += 'La date de consommation du vin est obligatoire même si elle est approximative. '
    }
    if (displayImage.src === '' || displayImage.src === undefined) {
        erreur += 'Il faut ajouter une photo de l\'étiquette du vin. '
    }

    if (erreur === undefined || erreur === '') {
        $('#partie-formulaire').hide()
        $('#loader').show()

        // On crée un formulaire à côté et on l'envoie en asynchrone
        fd = new FormData(document.getElementById('insertion-vin'))
        fd.append('etiquetteRedimensionnee', postCanvasToURL(canvas))
        fd.append('extensionImage', extensionImage)

        request = new XMLHttpRequest()
        request.open('post', '/insertion-vin', true)
        request.send(fd)

        // Si tout est ok, on redirige vers la page pour classer le vin
        request.onreadystatechange = function() {
            if(request.readyState == XMLHttpRequest.DONE && request.status == 200) {
                var data = JSON.parse(request.responseText)
                document.location.href = '/insertion-vin-part2?titre=' + data.titre + '&insertId=' + data.insertId + '&couleur=' + data.couleur + '&mode=' + data.mode
            }
        }
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
if (dd<10) {
    dd='0'+dd
} 
if (mm<10) {
    mm='0'+mm
} 

today = yyyy+'-'+mm+'-'+dd
document.getElementById('date_consommation').setAttribute('max', today)

// Put the input file image in a canvas
$('#etiquette').change(function(event){

    $('#displayImage').css('display', 'block')
    $('#displayImage').attr('src', URL.createObjectURL(event.target.files[0]))
    extensionImage = '.' + $('#etiquette').val().split('.').pop()

    $('#displayImage').on('load', function() {
        containerWidth = document.getElementById('container').clientWidth
        largeurImage = document.getElementById('displayImage').width
        hauteurImage = document.getElementById('displayImage').height
        dimensionsImage = dimensionnerImage(largeurImage, hauteurImage, containerWidth)
        canvas = document.getElementById('canvas')
        if(!canvas) {
            console.log("Impossible de récupérer le canvas")
            return
        }

        context = canvas.getContext('2d')
        if(!context) {
            alert("Impossible de récupérer le context du canvas")
            return
        }

        img = new Image()
        img.src = URL.createObjectURL(event.target.files[0])
        img.addEventListener('load', function() {
            $('#canvas').attr('width', dimensionsImage.largeurImage).attr('height', dimensionsImage.hauteurImage)
            context.drawImage(img, 0, 0, largeurImage, hauteurImage, 0, 0, dimensionsImage.largeurImage, dimensionsImage.hauteurImage)
        }, false)
    })
    $('#displayImage').css('display', 'none')
})