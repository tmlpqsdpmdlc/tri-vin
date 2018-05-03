let express = require('express')
let app = require('express')()
let bodyParser = require('body-parser')


// Moteur de template
app.set('view engine', 'ejs')

// Middleware
app.use('/assets', express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.set('trust proxy', 1)

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

app.listen(8080)