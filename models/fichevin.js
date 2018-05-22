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
        connection.query(`insert into vins (nom, millesime, couleur, date_consommation, commentaire_personnel, etiquette) `
        + `select * from (select ?, ?, ?, ?, ?, ?) as tmp `
        + `where not exists( `
        + `select nom, millesime, couleur from vins where nom = ? and millesime = ? and couleur = ? `
        +  `) limit 1;`, 
            [nom, millesime, couleur, date_consommation, commentaire_personnel, etiquette, nom, millesime, couleur], (error, result, fields) => {
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

    // Faire la liste de tous les vins de cette couleur: 0 rouge, 1 blanc, 2 rosé
    static getPersonnalListOfTheseWines(couleur, id_membres, cb) {
        console.log('getPersonnalListOfTheseWines')
        connection.query(
            `select * from vins `+
            `join classements_personnels_vins on vins.id_vins = classements_personnels_vins.id_vins `+
            `join membres on membres.id_membres = classements_personnels_vins.id_membres `+
            `where membres.id_membres = ? and vins.couleur like ? `+
            `order by classements_personnels_vins.classements_personnels_vins;`,
            [id_membres, couleur],
            (error, results, fields) => {
                if (error) throw error
                // On doit maintenant séparer les objets reçus et les mettre dans un tableau
                let nbreResultats = results.length
                let retour = []
                let objetTemporaire = {}
                for (var i = 0 ; i <= nbreResultats - 1 ; i++) {
                    objetTemporaire.id_vins = results[i].id_vins
                    objetTemporaire.nom = results[i].nom
                    objetTemporaire.millesime = results[i].millesime
                    objetTemporaire.couleur = results[i].couleur
                    objetTemporaire.date_consommation = moment(results[i].date_consommation)
                    objetTemporaire.etiquette = results[i].etiquette
                    objetTemporaire.commentaire_personnel = results[i].commentaire_personnel
                    objetTemporaire.classements_personnels_vins = results[i].classements_personnels_vins
                    retour.push(objetTemporaire)
                    objetTemporaire = new Object()
                }
                cb(retour)
            }
        )
    }

    // ajouter un vin au classement personnel
    static ajouterAuClassementPersonnel(id_vins, id_membres, couleur, classements_personnels_vins, cb) {
        console.log('ajouterAuClassementPersonnel')

        // On va incrémenter le classement personnel de tous les vins de classement supérieur ou égal
        connection.query(
            `select * from vins `+
            `join classements_personnels_vins on vins.id_vins = classements_personnels_vins.id_vins `+
            `join membres on membres.id_membres = classements_personnels_vins.id_membres `+
            `where membres.id_membres = ? and vins.couleur like ? `+
            `order by classements_personnels_vins.classements_personnels_vins;`,
            [id_membres, couleur],
            (error, results, fields) => {
                if (error) throw error
                for(var i = 0 ; i < results.length ; i++) {
                    if (results[i].classements_personnels_vins >= classements_personnels_vins) {
                        let nvoClassement = results[i].classements_personnels_vins + 1
                        let id_vin = results[i].id_vins
                        connection.query('update classements_personnels_vins set classements_personnels_vins = ? where id_vins = ? and id_membres = ? ', [nvoClassement, id_vin, id_membres], (error2, results2, fields2) => {
                            if (error2) throw error2
                        })
                    }
                }
                // On insère le nouveau vin dans le classement
                connection.query(`insert into classements_personnels_vins (id_vins, id_membres, classements_personnels_vins) `
                + `select * from (select ?,?,?) as tmp `
                + `where not exists( `
                +   `SELECT id_vins, id_membres FROM classements_personnels_vins WHERE id_vins = ? and id_membres = ? `
                + `) limit 1;`
                , [id_vins, id_membres, classements_personnels_vins, id_vins, id_membres], (error2, results2, fields2) => {
                    if (error2) throw error2
                })
            }
        )
        cb('c\'est bat')
    }

    // Obtenir les informations relatives à 1 vin avec son id en étant connecté
    static getFicheVinWithIdBeingCo(id_vins, id_membres) {
        console.log("getFicheVinWithIdBeingCo")
        
    }

    // Obtenir les informations relatives à 1 vin avec son id en étant déconnecté
    static getFicheVinWithIdNotBeingCo(id_vins, cb) {
        console.log("getFicheVinWithIdNotBeingCo")
        connection.query('select * from vins where id_vins = ?', [id_vins], (error, results, fields) => {
            if (error) throw error
            cb(results)
        })
    }
}

module.exports = FicheVin