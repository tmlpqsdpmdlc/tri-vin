module.exports = (request, response, next) => {

    // Gestion des messages d'erreur de formulaire
    if(request.session.flash) {
        response.locals.flash = request.session.flash
        request.session.flash = undefined
    }

    request.flash = (type, content) => {
        if (request.session.flash === undefined) {
            request.session.flash = {}
        }
        request.session.flash[type] = content
    }

    //Gestion de connexion
    if(request.session.cnx) {
        if (request.session.cnx === 0) {
            request.session.cnx = undefined
        }
        response.locals.cnx = request.session.cnx
    }

    request.cnx = (etat, id_membre) => {
        if (request.session.cnx === undefined) {
            request.session.cnx = {}
        }
        if (etat === 1) {
            request.session.cnx = id_membre
        } else {
            request.session.cnx = 0
        }
    }

    next()
}