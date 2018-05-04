let connection = require('../config/db')
let moment = require('moment')
moment.locale('fr')

class FicheVin {

    constructor(row) {
        this.row = row
    }

    get id_vins() {
        return this.row.id_vins
    }

    get nom() {
        return this.row.nom
    }

    get millesime() {
        return this.row.millesime
    }

    get couleur() {
        return this.row.couleur
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
        return this.row.classement_general
    }

    get cepages() {
        let listeCepages = []
        connection.query(`select cepages.nom from cepages
        join vins_has_cepages on vins_has_cepages.id_cepages and cepages.id_cepages
        join vins on vins_has_cepages.id_vins and vins.id_vins
        where vins.couleur like ? and vins.id_vins = ?;`, [this.row.couleur, this.row.id_vins], (err, rows) => {
            if (err) throw err
            for (let row of rows) {
                listeCepages.push(row)
            }
        })
        return listeCepages
    }

    get vignerons() {
        let listeVignerons = []
        connection.query(`select vignerons.nom from vignerons
        join vins_has_vignerons on vins_has_vignerons.id_vignerons and vignerons.id_vignerons
        join vins on vins_has_vignerons.id_vins and vins.id_vins
        where vins.couleur like ? and vins.id_vins = ?;`, [this.row.couleur, this.row.id_vins], (err, rows) => {
            if (err) throw err
            for (let row of rows) {
                listeVignerons.push(row)
            }
        })
        return listeVignerons
    }

    // Méthodes statiques concernant des listes
    static getAllClassementPersonnel(couleur, id_membres, cb) {
        connection.query(`select vins.id_vins, vins.nom, millesime, vins.date_consommation, vins.etiquette, vins.commentaire_personnel, vins.classement_general from vins 
        join classements_personnels_vins on vins.id_vins and classements_personnels_vins.id_classements_personnels_vins
        where vins.couleur like ? and classements_personnels_vins.id_membres = ?
        order by classements_personnels_vins.classement_personnel_vins;`, [couleur, id_membres], (err, rows) => {
            if (err) throw err
            cb(rows.map((row) => new FicheVin(row)))
        })
    }

    static getAllClassementGeneral(couleur, cb)
    {
        connection.query('select * from vins where couleur like ? order by classement_general', [couleur], (err, rows) => {
            if (err) throw err
            cb(rows.map((row) => new FicheVin(row)))
        })
    }
}

module.exports = FicheVin