let express = require('express')
let app = require('express')()
let bodyParser = require('body-parser')
let session = require('express-session')
let fileUpload = require('express-fileupload')
let path = require('path')

// Moteur de template
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
    response.render('pages/index', {titre: "page d'accueil"})
})

app.get('/classement-personnel', (request, response) => { 
    response.render('pages/classement-personnel', {titre: "classement personnel", insertId: false, couleur: false, mode: 'consultation'})
})

app.get('/insertion-vin', (request, response) => {
    response.render('pages/insertion-vin', {titre: 'insertion vin'})
})

app.post('/insertion-vin', (request, response) => {
    // on enregistre les valeurs reçues du formulaire
    let nom = request.body.nom
    let millesime = request.body.millesime
    let couleur = request.body.couleur
    let date_consommation = request.body.date_consommation
    let commentaire_personnel = request.body.commentaire_personnel
    let id_membres = request.body.id_membres

    // on vérifie que ce vin n'est pas déjà dans le classement de ce membre
    let ficheVin = require('./models/fichevin')
    ficheVin.checkIfAlreadyExistsInMyRanking(nom, millesime, couleur, id_membres, (checkIfAlreadyExistsInMyRanking) => {
        if (checkIfAlreadyExistsInMyRanking === 'true')
        {
            request.flash("erreurInsertion", "Ce vin est déjà dans votre classement")
            response.redirect('/insertion-vin')
        }
        else
        {
            // on enregistre les valeurs dans la bases
            let etiquette = __dirname + '/public/images/empty.png'
            ficheVin.insertionVin(nom, millesime, couleur, date_consommation, commentaire_personnel, etiquette, id_membres, (insertId) => {
                //  on récupère l'id du vin et on nommera la photo comme ça
                etiquette = __dirname + '/public/images/' + insertId + path.extname(request.files.etiquette.name)
                // on sauvegarde la photo avec ce nom
                request.files.etiquette.mv(etiquette, (erreur) => {
                    if (erreur) throw erreur
                    // on update la valeur du nom de la photo dans la bdd si elle n'est pas déjà dedans
                    etiquette = 'assets/images/' + insertId + path.extname(request.files.etiquette.name)
                    ficheVin.modifierValeurEtiquette(insertId, etiquette)
                    // on dirige vers la page de classement personnel avec le numéro de l'id du vin à insérer et la couleur de ce vin
                    response.render('pages/classement-personnel', {titre: "classement personnel", insertId: insertId, couleur: couleur, mode: 'insert'})
                })
            })
        }
    })
})

app.get('/communaute', (request, response) => { 
    response.render('pages/communaute', {titre: "communauté"})
})

app.get('/creationcompte', (request, response) => { 
    response.render('pages/creationcompte', {titre: "Compte créée"})
})

app.get('/connexion', (request, response) => {
    response.render('pages/connexion', {titre: "Utilisateur connecté"})
})

app.get('/ficheVin', (request, response) => {
    // C'est la page qui déterminera s'il y a un utilisateur connecté
    response.render('pages/fichevin', {titre: "Fiche vin"})
})

app.get('/deconnexion', (request, response) => {
    request.cnx(0,0)
    response.render('pages/deconnexion', {titre: "Utilisateur déconnecté"})
})

app.post('/connexion', (request, response) => {
    // On doit vérifier si l'utilisateur se connecte bien 
    if (request.body.email === undefined || 
        request.body.email === '' || 
        request.body.psw === undefined ||
        request.body.psw === ''
    )
    {
        request.flash("erreurConnexion", "Veuillez saisir un email et un mot de passe pour vous connecter")
        response.redirect('/communaute')
    }
    else
    {
        let ficheMembre = require('./models/fichemembre')
        ficheMembre.connexion(request.body.email, request.body.psw, (retour) => {
            if (retour !== "Erreur") {
                request.cnx(1, retour)
                response.redirect('/connexion')
            }
            else
            {
                request.flash("erreurConnexion", "Erreur lors de la connexion, veuillez vérifier vos identifiants.")
                response.redirect('/communaute')
            }
        })
    }   
})

app.post('/creationcompte', (request, response) => {
    // On vérifie que tous les champs sont biens remplis avant d'insérer
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
        request.flash('errorCreation', "Tous les champs n'ont pas été saisis")
        response.redirect('/communaute')
    }
    else
    {
        let ficheMembre = require('./models/fichemembre')
        ficheMembre.validerFormulaireCreationCompte(request.body.email1, request.body.email2, request.body.psw1, request.body.psw2, (email, psw) => {
            let messageErreur = ""
            if (email === false)
            {
                messageErreur = "Les emails sont différents. "
            }

            if (psw === false) {
                messageErreur += "Les mots de passes sont différents. "
            }

            if (messageErreur !== "") {
                request.flash('errorCreation', messageErreur)
                response.redirect('/communaute')
            }
            else
            {
                ficheMembre.addMembre(request.body.email1, request.body.psw1, (res) => {
                    if (res === "") {
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

// Appels Ajax

// On va chercher dans la base une fiche de vin en différenciant connecté ou déconnecté
app.post('/getFicheVin', (request, response) => {
    let fichevin = require('./models/ficheVin')
    let id_membres = request.body.id_membres
    let id_vins = request.body.id_vins

    if (id_membres !== false && id_membres !== "false") {
        // si id_membres alors version co
        fichevin.getFicheVinWithIdBeingCo(id_vins, id_membres, (data) => {
            response.send(data)
        })  
    } else {
        // si pas d'id membre alors version déco
        fichevin.getFicheVinWithIdNotBeingCo(id_vins, (data) => {
            response.send(data)
        })
    }
})

// on insère un vin à sa place dans le classement
app.post('/classerpesonnel', (request, response) => {
    let fichevin = require('./models/ficheVin')
    fichevin.ajouterAuClassementPersonnel(request.body.id_vins, request.body.id_membres, request.body.couleur, request.body.classements_personnels_vins, (ce_genre_de_cb) => {
        response.send('c\'est ok')
    })
})

// on va chercher le classement personnel pour une couleur donnée
app.post('/listepersonnelle', (request, response) => {
    let fichevin = require('./models/ficheVin')
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


app.listen(8080)