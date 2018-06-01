let connection = require('../config/db')
let hash = require('hash.js')

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
                let hashed_psw = hash.sha256().update(psw).digest('hex')
                connection.query('insert into membres set email = ?, password = ?', [email, hashed_psw], (err, res) => {
                    if (err) throw err
                    cb("")
                })
            }
        })
    }

    static validerFormulaireCreationCompte(email1, email2, psw1, psw2, cb) {
        console.log('validerFormulaireCreationCompte')
        let erreur_email = ''
        let erreur_psw = ''
        let regex_mail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        let regex_psw = /^[0-9a-zA-Z]{6,}$/

        if (email1 === email2) {
            if (regex_mail.test(String(email1).toLowerCase())) {
                erreur_email = true
            } else {
                erreur_email = 'Veuillez entrer un email valide. '
            }
        } else {
            erreur_email = 'Les mails sont différents. '
        }

        if (psw1 === psw2) {
            if (regex_psw.test(String(psw1).toLowerCase())) {
                erreur_psw = true
            } else {
                erreur_psw = 'Le mot de passe ne doit pas contenir de caractères spéciaux et doit faire au moins 6 caractères. '
            }
        } else {
            erreur_psw = 'Les mots de passe sont différents. '
        }
        cb(erreur_email, erreur_psw)
    }

    static connexion(email, psw, cb) {
        let hashed_psw = hash.sha256().update(psw).digest('hex')
        connection.query('select * from membres where email like ? and password like ?', [email, hashed_psw], (err, rows) => {
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