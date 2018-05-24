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

    // On insère un vin s'il est nouveau dans la bdd et ensuite, on insère les données personnelles
    static insertionVin(nom, millesime, couleur, date_consommation, commentaire_personnel, etiquette, id_membres, cb) {
        console.log('insertionVin')
        connection.query(`insert into vins (nom, millesime, couleur, etiquette) `
        + `select * from (select ?, ?, ?, ?) as tmp `
        + `where not exists( `
        + `select nom, millesime, couleur from vins where nom = ? and millesime = ? and couleur = ? `
        +  `) limit 1;`, 
            [nom, millesime, couleur, etiquette, nom, millesime, couleur], (error, result, fields) => {
            if (error) throw error

            let id_vins = result.insertId
            // 0 si déjà dans la base, on doit aller chercher son id
            if (id_vins === 0 || id_vins === undefined) {
                connection.query('select * from vins where nom = ? and millesime = ? and couleur = ?',
                [nom, millesime, couleur],
                (error2, results2, fields2) => {
                    if (error2) throw error2
                    id_vins = results2[0].id_vins
                    // insertion des données personnelles
                    connection.query(`insert into classements_personnels_vins (id_vins, id_membres, commentaire_personnel, date_consommation) `
                        + `values (?, ?, ?, ?)`,
                        [id_vins, id_membres, commentaire_personnel, date_consommation],
                        (error2, result2, fields2) => {
                            if (error2) throw error2
                            cb(id_vins)
                    })
                })
            } else {
                // insertion des données personnelles
                connection.query(`insert into classements_personnels_vins (id_vins, id_membres, commentaire_personnel, date_consommation) `
                    + `values (?, ?, ?, ?)`,
                    [id_vins, id_membres, commentaire_personnel, date_consommation],
                    (error2, result2, fields2) => {
                        if (error2) throw error2
                        cb(id_vins)
                })
            }
        })
    }

    // On met à jour la valeur de l'étiquette si elle n'est pas sur empty
    static modifierValeurEtiquette(id_vins, etiquette) {
        console.log('modifierValeurEtiquette')
        connection.query("select * from vins where id_vins = ? and etiquette like '%empty%'", [id_vins], (error, results, fields) => {
            if (error) throw error
            console.log('nbre resultats', results.length)
            if (results.length >= 1) {
                connection.query('update vins set etiquette = ? where id_vins = ?', [etiquette, id_vins], (error2, result2, fields2) => {
                    if (error2) throw error2
                })
            }
        })
    }

    // Vérification de si un vin existe déjà dans le classement d'un membre
    static checkIfAlreadyExistsInMyRanking(nom, millesime, couleur, id_membres, cb) {
        console.log('checkIfAlreadyExistsInMyRanking')
        connection.query(`select * from vins `
            + `join classements_personnels_vins on classements_personnels_vins.id_vins and vins.id_vins `
            + `where vins.nom like ? `
            + `and vins.millesime = ? `
            + `and vins.couleur like ? `
            + `and classements_personnels_vins.id_membres = ?;`, 
        [nom, millesime, couleur, id_membres], 
        (error, result, fields) => {
            if (error) throw error
            if (result.length >= 1 )
            {
                cb('true')
            } else {
                cb('false')
            }
        })
    }

    // Faire la liste de vin classée d'une couleur donnée pour un membre
    static getPersonnalListOfTheseWines(couleur, id_membres, cb) {
        console.log('getPersonnalListOfTheseWines')
        connection.query(
            `select * from vins `+
            `join classements_personnels_vins on vins.id_vins = classements_personnels_vins.id_vins `+
            `where classements_personnels_vins.id_membres = ? and vins.couleur like ? and classements_personnels_vins.classements_personnels_vins is not null `+
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
                    objetTemporaire.etiquette = results[i].etiquette
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
            `where classements_personnels_vins.id_membres = ? and vins.couleur like ? `+
            `order by classements_personnels_vins.classements_personnels_vins;`,
            [id_membres, couleur],
            (error, results, fields) => {
                if (error) throw error
                for(var i = 0 ; i < results.length ; i++) {
                    if (results[i].classements_personnels_vins >= classements_personnels_vins) {
                        let nvoClassement = results[i].classements_personnels_vins + 1
                        let id_vin = results[i].id_vins
                        connection.query('update classements_personnels_vins set classements_personnels_vins = ? where id_vins = ? and id_membres = ? ', 
                        [nvoClassement, id_vin, id_membres], 
                        (error2, results2, fields2) => {
                            if (error2) throw error2
                        })
                    }
                }
                // On va ajouter sa place au classement
                connection.query('update classements_personnels_vins set classements_personnels_vins = ? where id_vins = ? and id_membres = ? ', 
                [classements_personnels_vins, id_vins, id_membres],
                (error2, results2, fields2) => {
                    if (error2) throw error2
                })
            }
        )
        cb('c\'est bat')
    }
  
    // Obtenir les informations relatives à 1 vin avec son id en étant connecté
    static getFicheVinWithIdBeingCo(id_vins, id_membres, cb) {
        console.log("getFicheVinWithIdBeingCo")
        connection.query(`select * from vins `
        + `join classements_personnels_vins on classements_personnels_vins.id_vins and vins.id_vins `
        + `where classements_personnels_vins.id_vins = ? and vins.id_vins = ? and classements_personnels_vins.id_membres = ? `
        + `limit 1;`, 
        [id_vins, id_vins, id_membres], 
        (error, results, fields) => {
            if (error) throw error
            cb(results[0])
        })
    }

    // Obtenir les informations relatives à 1 vin avec son id en étant déconnecté
    static getFicheVinWithIdNotBeingCo(id_vins, cb) {
        console.log("getFicheVinWithIdNotBeingCo")
        connection.query('select * from vins where id_vins = ?', [id_vins], (error, results, fields) => {
            if (error) throw error
            cb(results[0])
        })
    }
}

module.exports = FicheVin