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

    // static methods
    static addMembre(email, psw, cb) {

        connection.query('select * from membres where email like ?;', email, (err, rows) => {
            if (err) throw err
            if (rows.length > 0) {
                cb("membre déjà existant")
            }
            else
            {
                connection.query('insert into membres set email = ?, password = ?', [email, psw], (err, res) => {
                    if (err) throw err
                    cb("")
                })
            }
        })
    }

    static validerFormulaireCreationCompte(email1, email2, psw1, psw2, cb) {
        let email = false
        let psw = false

        if (email1 === email2) {
            email = true
        }

        if (psw1 === psw2) {
            psw = true
        }
        cb(email, psw)
    }

    static connexion(email, psw, cb) {
        connection.query('select * from membres where email like ? and password like ?', [email, psw], (err, rows) => {
            if (err) throw err
            if(rows.length !== 1) {
                cb("Erreur")
            }
            else
            {
                cb(rows[0].id_membres)
            }
        })
    }
}

module.exports = FicheMembre