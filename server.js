let express = require('express')
let app = require('express')()
let bodyParser = require('body-parser')
let session = require('express-session')
let formidable = require('formidable')

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

// Routes
app.get('/', (request, response) => { 
    response.render('pages/index', {titre: "page d'accueil"})
})

app.get('/classement-personnel', (request, response) => { 
    response.render('pages/classement-personnel', {titre: "classement personnel"})
})

app.post('/classement-personnel', (request, response) => { 


    // Dans ce cas, il faut vérifier que les éléménts soient biens remplis avant de faire des traitements
    
    let form = new formidable.IncomingForm()
    form.parse(request)

    form.on('fileBegin', (name, file) => {
        if(file.size !== 0)
        {
            file.path = __dirname + '/uploads/' + file.name
        }
    })

    form.on('file', (name, file) => {
        console.log('Uploaded ' + file.name)
    })

    form.on('field', function(name, value) {
        console.log('name', name)
        console.log('value', value)
    })

    form.on('error', function(err) {
        console.log(err)
        throw err
    })

    form.on('aborted', function() {
        console.log('upload arrêté par à l\initiative de l\'utilisateur')
    })

    form.on('end', function() {
        response.redirect('/classement-personnel')
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
    if (request.body.email1 === undefined ||
        request.body.email1 === '' ||
        request.body.email2 === '' ||
        request.body.email2 === '' ||
        request.body.psw1 === '' ||
        request.body.psw1 === '' ||
        request.body.psw2 === '' ||
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

app.listen(8080)