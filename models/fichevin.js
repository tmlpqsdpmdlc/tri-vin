let connection = require('../config/db')
let moment = require('moment')
moment.locale('fr')

class FicheVin {

    constructor() {
    }

    get id_vins() {
        return this.id_vins
    }

    get nom() {
        return this.nom
    }

    set nom(nom) {
        this.nom = nom
    }

    get millesime() {
        return this.millesime
    }

    set millesime(millesime) {
        this.millesime = millesime
    }

    get couleur() {
        return this.couleur
    }

    set couleur(couleur) {
        this.couleur = couleur
    }

    get date_consommation() {
        return moment(this.date_consommation)
    }

    set date_consommation(date_consommation) {
        this.date_consommation = date_consommation
    }

    get etiquette() {
        return this.etiquette
    }

    set etiquette(etiquette) {
        this.etiquette = etiquette
    }

    get commentaire_personnel() {
        return this.commentaire_personnel
    }

    set commentaire_personnel(commentaire_personnel) {
        this.commentaire_personnel = commentaire_personnel
    }

    get classement_general() {
        return this.classement_general
    }

    set classement_general(classement_general) {
        this.classement_general = classement_general
    }

    // get cepages() {
    //     let listeCepages = []
    //     connection.query(`select cepages.nom from cepages
    //     join vins_has_cepages on vins_has_cepages.id_cepages and cepages.id_cepages
    //     join vins on vins_has_cepages.id_vins and vins.id_vins
    //     where vins.couleur like ? and vins.id_vins = ?;`, [this.couleur, this.id_vins], (err, rows) => {
    //         if (err) throw err
    //         for (let row of rows) {
    //             listeCepages.push(row)
    //         }
    //     })
    //     return listeCepages
    // }

    // get vignerons() {
    //     let listeVignerons = []
    //     connection.query(`select vignerons.nom from vignerons
    //     join vins_has_vignerons on vins_has_vignerons.id_vignerons and vignerons.id_vignerons
    //     join vins on vins_has_vignerons.id_vins and vins.id_vins
    //     where vins.couleur like ? and vins.id_vins = ?;`, [this.couleur, this.id_vins], (err, rows) => {
    //         if (err) throw err
    //         for (let row of rows) {
    //             listeVignerons.push(row)
    //         }
    //     })
    //     return listeVignerons
    // }

    static insertionVin(nom, millesime, couleur, date_consommation, commentaire_personnel, etiquette, cb) {
        console.log('insertionVin')
        connection.query('insert into vins set nom = ?, millesime = ?, couleur = ?, date_consommation = ?, commentaire_personnel = ?, etiquette = ?', [nom, millesime, couleur, date_consommation, commentaire_personnel, etiquette], (error, result, fields) => {
            if (error) throw error
            cb(result.insertId)
        })
    }

    static modifierValeurEtiquette(id_vins, etiquette) {
        console.log('modifierValeurEtiquette')
        connection.query('update vins set etiquette = ? where id_vins = ?', [etiquette, id_vins], (error, result, fields) => {
            if (error) throw error
        })
    }

    // Vérification de si un vin existe déjà
    static checkIfAlreadyExists(nom, millesime, couleur, cb) {
        console.log('checkIfAlreadyExists')
        connection.query('select * from vins where nom like ? and millesime like ? and couleur like ?', [nom, millesime, couleur], (error, result, fields) => {
            if (error) throw error
            if (result.length >= 1 )
            {
                cb('true')
            }
            else
            {
                cb('false')
            }
        })
    }

    // static getAllClassementPersonnel(couleur, id_membres, cb) {
    //     connection.query(`select vins.id_vins, vins.nom, millesime, vins.date_consommation, vins.etiquette, vins.commentaire_personnel, vins.classement_general from vins 
    //     join classements_personnels_vins on vins.id_vins and classements_personnels_vins.id_vins
    //     where vins.couleur like ? and classements_personnels_vins.id_membres = ?
    //     order by classements_personnels_vins.classement_personnel_vins;`, [couleur, id_membres], (err, rows) => {
    //         if (err) throw err
    //         cb(rows.map((row) => new FicheVin(row)))
    //     })
    // }

    // static getAllClassementGeneral(couleur, cb)
    // {
    //     connection.query('select * from vins where couleur like ? order by classement_general', [couleur], (err, rows) => {
    //         if (err) throw err
    //         cb(rows.map((row) => new FicheVin(row)))
    //     })
    // }
}

module.exports = FicheVin