let connection = require('../config/db')
let moment = require('moment')
moment.locale('fr')

class FicheVinRouge {

    constructor(row) {
        this.row = row
    }

    get id_vins_rouges() {
        return this.row.id_vins_rouges
    }

    get nom() {
        return this.row.nom
    }

    get millesime() {
        return this.row.millesime
    }

    get date_consommation() {
        return this.row.date_consommation
    }

    get etiquette() {
        return this.row.etiquette
    }

    get commentaire_personnel() {
        return this.row.commentaire_personnel
    }

    get classement_general() {
        return this.classement_general
    }

    static getClassementPersonnelVinsRouges(id_vins_rouges, id_membres, cb) {
        connection.query('select * from classements_personnels_vins_rouges where id_vins_rouges = ? and id_membres = ? limit 1;', [id_vins_rouges, id_membres], (err, rows) => {
            if (err) throw err
            cb(row[0].classement_personnel_vins_rouges)
        })
    }
}

module.exports = FicheVin