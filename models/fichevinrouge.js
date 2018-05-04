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

    static getAllClassementPersonnelVinsRouges(id_membres, cb) {
        connection.query(`select vins_rouges.id_vins_rouges, vins_rouges.nom, millesime, vins_rouges.date_consommation, vins_rouges.etiquette, vins_rouges.commentaire_personnel, vins_rouges.classement_general from vins_rouges 
        join classements_personnels_vins_rouges on vins_rouges.id_vins_rouges and classements_personnels_vins_rouges.id_classements_personnels_vins_rouges
        where classements_personnels_vins_rouges.id_membres = ?
        order by classements_personnels_vins_rouges.classement_personnel_vins_rouges;`, [id_membres], (err, rows) => {
            if (err) throw err
            cb(rows.map((row) => new FicheVinRouge(row)))
        })
    }

    static getAllClassementGeneralVinsRouges(cb)
    {
        connection.query('select * from vins_rouges order by classement_general', (err, rows) => {
            if (err) throw err
            cb(rows.map((row) => new FicheVinRouge(row)))
        })
    }
}

module.exports = FicheVin