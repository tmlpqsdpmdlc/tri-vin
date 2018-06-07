let express = require('express')
let app = require('express')()
let bodyParser = require('body-parser')
let session = require('express-session')
let fileUpload = require('express-fileupload')
let path = require('path')

// Template engine
app.set('view engine', 'ejs')

// Middleware
app.use('/assets', express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.set('trust proxy', 1)
app.use(session({
    secret: 'cuicui',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))
app.use(require('./middlewares/flash'))
app.use(fileUpload())

// Routes
app.get('/', (request, response) => { 
    response.render('pages/index', {titre: 'page d\'accueil', couleur: false})
})

app.get('/classement-personnel', (request, response) => { 
    let couleur = request.query.couleur
    if (couleur === '' || couleur === undefined) {
        couleur = false
    }

    response.render('pages/classement-personnel', {titre: 'classement personnel', insertId: false, couleur: couleur, mode: 'consultation'})
})

app.get('/insertion-vin', (request, response) => {
    let couleur = request.query.couleur
    if (couleur === '' || couleur === undefined) {
        couleur = false
    }
    response.render('pages/insertion-vin', {titre: 'insertion vin', couleur: couleur})
})

app.get('/insertion-vin-part2', (request, response) => {
    let titre = request.query.titre
    let insertId = request.query.insertId
    let couleur = request.query.couleur
    let mode = request.query.mode
    
    response.render('pages/classement-personnel', {titre: titre, insertId: insertId, couleur: couleur, mode: mode})
})

app.post('/insertion-vin', (request, response) => {

    // Save datas from the form
    let nom = request.body.nom
    let millesime = request.body.millesime
    let couleur = request.body.couleur
    let date_consommation = request.body.date_consommation
    let commentaire_personnel = request.body.commentaire_personnel
    let id_membres = request.body.id_membres
    let extensionImage = request.body.extensionImage

    // Check if this wine isn't already in the member ranking
    let ficheVin = require('./models/fichevin')
    ficheVin.checkIfAlreadyExistsInMyRanking(nom, millesime, couleur, id_membres, (checkIfAlreadyExistsInMyRanking) => {
        if (checkIfAlreadyExistsInMyRanking === 'true')
        {
            request.flash('erreurInsertion', 'Ce vin est déjà dans votre classement')
            response.redirect('/insertion-vin')
        }
        else
        {
            // save data in the db
            let etiquette = __dirname + '/public/images/empty.png'
            ficheVin.insertionVin(nom, millesime, couleur, date_consommation, commentaire_personnel, etiquette, id_membres, (insertId) => {
                // get the wine id and name the picture with it
                etiquette = __dirname + '/public/images/' + insertId + extensionImage
                // write the picture with this name
                request.files.etiquetteRedimensionnee.mv(etiquette, (erreur) => {
                    if (erreur) throw erreur
                    // update the picture's name value in the db if it's not already there
                    etiquette = 'assets/images/' + insertId + extensionImage
                    ficheVin.modifierValeurEtiquette(insertId, etiquette)
                    // locate towards the page classement-personnnel with the wine id to insert and the color of this wine
                    response.send({titre: 'classement personnel', insertId: insertId, couleur: couleur, mode: 'insert'})
                })
            })
        }
    })
})

app.get('/communaute', (request, response) => { 
    response.render('pages/communaute', {titre: 'communauté'})
})

app.get('/creationcompte', (request, response) => { 
    response.render('pages/creationcompte', {titre: 'Compte créée'})
})

app.get('/connexion', (request, response) => {
    response.render('pages/connexion', {titre: 'Utilisateur connecté'})
})

app.get('/ficheVin', (request, response) => {
    // The page will control if the user is logged in
    response.render('pages/fichevin', {titre: 'Fiche vin'})
})

app.get('/deconnexion', (request, response) => {
    request.cnx(0,0)
    response.render('pages/deconnexion', {titre: 'Utilisateur déconnecté'})
})

app.post('/connexion', (request, response) => {
    // check if the user wrote correctly in the form
    if (request.body.email === undefined || 
        request.body.email === '' || 
        request.body.psw === undefined ||
        request.body.psw === ''
    )
    {
        request.flash('erreurConnexion', 'Veuillez saisir un email et un mot de passe pour vous connecter')
        response.redirect('/communaute')
    }
    else
    {
        let ficheMembre = require('./models/fichemembre')
        ficheMembre.connexion(request.body.email, request.body.psw, (retour) => {
            if (retour !== 'Erreur') {
                request.cnx(1, retour)
                response.redirect('/connexion')
            }
            else
            {
                request.flash('erreurConnexion', 'Erreur lors de la connexion, veuillez vérifier vos identifiants.')
                response.redirect('/communaute')
            }
        })
    }   
})

app.post('/creationcompte', (request, response) => {
    // check every fields before inserting
    if (request.body.email1 === undefined ||
        request.body.email1 === '' ||
        request.body.email2 === undefined ||
        request.body.email2 === '' ||
        request.body.psw1 === undefined ||
        request.body.psw1 === '' ||
        request.body.psw2 === undefined ||
        request.body.psw2 === ''
    )
    {
        request.flash('errorCreation', 'Tous les champs n\'ont pas été saisis')
        response.redirect('/communaute')
    }
    else
    {
        let ficheMembre = require('./models/fichemembre')
        ficheMembre.validerFormulaireCreationCompte(request.body.email1, request.body.email2, request.body.psw1, request.body.psw2, (email, psw) => {
            let messageErreur = ''
            if (email !== true)
            {
                messageErreur += email
            }

            if (psw !== true) {
                messageErreur += psw
            }

            if (messageErreur !== '') {
                request.flash('errorCreation', messageErreur)
                response.redirect('/communaute')
            }
            else
            {
                ficheMembre.addMembre(request.body.email1, request.body.psw1, (res) => {
                    if (res === '') {
                        response.redirect('/creationcompte')
                    }
                    else
                    {
                        request.flash('errorCreation', res)
                        response.redirect('/communaute')
                    }
                })
            }
        })
    }
})

// Ajax calls

// search in the db a wine folder differenciating logged in or not
app.post('/getFicheVin', (request, response) => {
    let fichevin = require('./models/fichevin')
    let id_membres = request.body.id_membres
    let id_vins = request.body.id_vins

    if (id_membres !== false && id_membres !== 'false') {
        // if id_membres then logged in
        fichevin.getFicheVinWithIdBeingCo(id_vins, id_membres, (data) => {
            if (data === undefined) {
                // Case when this wine was already inserted by someone else
                fichevin.getFicheVinWithIdNotBeingCo(id_vins, (data) => {
                    response.send(data)
                })
            } else {
                response.send(data)
            }
        })  
    } else {
        // if no id_membres the not logged in version
        fichevin.getFicheVinWithIdNotBeingCo(id_vins, (data) => {
            response.send(data)
        })
    }
})

// insert a wine at its right place in the ranking
app.post('/classerpesonnel', (request, response) => {
    let fichevin = require('./models/fichevin')
    fichevin.ajouterAuClassementPersonnel(request.body.id_vins, request.body.id_membres, request.body.couleur, request.body.classements_personnels_vins, (ce_genre_de_cb) => {
        fichevin.ajouterAuClassementGeneral(request.body.id_vins, request.body.id_membres, request.body.couleur, request.body.classements_personnels_vins, (cb) => {
            response.send({message: 'c\'est ok', cb1: ce_genre_de_cb, cb2: cb})
        })
    })
})

// look for the personal ranking for a chosen color
app.post('/listepersonnelle', (request, response) => {
    let fichevin = require('./models/fichevin')
    let couleur = request.body.couleur
    let id_membre = request.body.id_membre
    
    fichevin.getPersonnalListOfTheseWines(couleur, id_membre, (ce_genre_de_cb) => {
        if (ce_genre_de_cb.length === 0) {
            response.send({liste_des_vins_classes: []})
        } else {
            response.send({liste_des_vins_classes: ce_genre_de_cb})
        }
    })
})

// look for in the general ranking for a chosen color
app.post('/listegenerale', (request, response) => {
    let fichevin = require('./models/fichevin')
    let couleur = request.body.couleur
    
    fichevin.getListOfTheseWines(couleur, (ce_genre_de_cb) => {
        if (ce_genre_de_cb.length === 0) {
            response.send({liste_des_vins_classes: []})
        } else {
            response.send({liste_des_vins_classes: ce_genre_de_cb})
        }
    })
})

app.listen(8080)