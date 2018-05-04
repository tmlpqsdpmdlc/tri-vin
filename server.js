let express = require('express')
let app = require('express')()
let bodyParser = require('body-parser')
let session = require('express-session')

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

app.get('/communaute', (request, response) => { 
    response.render('pages/communaute', {titre: "communauté"})
})

app.get('/creationcompte', (request, response) => { 
    response.render('pages/creationcompte', {titre: "Compte créée"})
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