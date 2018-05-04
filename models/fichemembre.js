let connection = require('../config/db')

class FicheMembre {

    constructor(row) {
        this.row = row
    }

    get id_membres() {
        return this.row.id_membres
    }

    get email() {
        return this.row.email
    }

    // Méthodes statiques
    static addMembre(email, psw) {
        connection.query('inser into membres set email = ?, password = ?', [email, psw], (err, res) => {
            if (err) throw err
            cb(res)
        })
    }

}

module.exports = FicheMembre