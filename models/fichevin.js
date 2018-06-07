let connection = require('../config/db')
let moment = require('moment')
moment.locale('fr')

/**************private methods for the general ranking*********************/
// Calcul du coefficient de volatilité
function coeffK(nbr_de_matchs, cote) {
    console.log('coeffK')
    if (nbr_de_matchs <= 30) {
        return 40
    } else if (nbr_de_matchs > 30 && cote <= 2400) {
        return 20
    } else {
        return 10
    }
}

// Calcul du coefficient d'écart
// Calculate gap coefficient
function ED(coteVin1, coteVin2) {
    console.log('ED')
    return ((coteVin2 - coteVin1) / 400)
}

// calculate the winrate
function probaGagner(ED) {
    console.log('probaGagner')
    return (1 / ( 1 + Math.pow(10,ED)))
}

// Calculate the motion coefficient
function mouvance(proba, victoire) {
    console.log('mouvance')
    if (victoire) {
        return (proba - 1)
    } else {
        return (1 - proba)
    }
}

// complete function
function mouvementElo(nbr_de_matchs, coteVin1, coteVin2, victoire) {
    console.log('mouvementElo')
    return (coeffK(nbr_de_matchs, coteVin1) * mouvance(probaGagner(ED(coteVin1, coteVin2)), victoire))
}

class FicheVin {

    constructor() {
    }

    // Insert a wine if it's new in the db and then, insert the personnal datas
    static insertionVin(nom, millesime, couleur, date_consommation, commentaire_personnel, etiquette, id_membres, cb) {
        console.log('insertionVin')
        connection.query(`insert into vins (nom, millesime, couleur, etiquette, classement_general, nbr_de_matchs) `
        + `select * from (select ?, ?, ?, ?, 1500, 0) as tmp `
        + `where not exists( `
        + `select nom, millesime, couleur from vins where nom = ? and millesime = ? and couleur = ? `
        +  `) limit 1;`, 
        [nom, millesime, couleur, etiquette, nom, millesime, couleur], 
        (error, result) => {
            if (error) throw error

            let id_vins = result.insertId
            // 0 if already in the db, we need to get its id
            if (id_vins === 0 || id_vins === undefined) {
                connection.query('select * from vins where nom like ? and millesime = ? and couleur like ?',
                    [nom, millesime, couleur],
                    (error2, results2) => {
                        if (error2) throw error2
                        id_vins = results2[0].id_vins
                        // Insertion of personnal datas
                        connection.query(`insert into classements_personnels_vins (id_vins, id_membres, commentaire_personnel, date_consommation) `
                        + `select * from (select ? as idvins, ? as idmembres, ?, ?) as tmp `
                        + `where not exists( `
                        + `    select id_vins, id_membres from classements_personnels_vins WHERE id_vins = ? and id_membres = ? `
                        + `) `
                        + `limit 1;`,
                        [id_vins, id_membres, commentaire_personnel, date_consommation, id_vins, id_membres],
                        (error3) => {
                            if (error3) throw error3
                            cb(id_vins)
                        })
                    })
            } else {
                // Insertion of personnal datas
                connection.query(`insert into classements_personnels_vins (id_vins, id_membres, commentaire_personnel, date_consommation) `
                    + `values (?, ?, ?, ?)`,
                [id_vins, id_membres, commentaire_personnel, date_consommation],
                (error2) => {
                    if (error2) throw error2
                    cb(id_vins)
                })
            }
        })
    }

    // update the label if it's not on empty
    static modifierValeurEtiquette(id_vins, etiquette) {
        console.log('modifierValeurEtiquette')
        connection.query("select * from vins where id_vins = ? and etiquette like '%empty%'", [id_vins], (error, results) => {
            if (error) throw error
            if (results.length >= 1) {
                connection.query('update vins set etiquette = ? where id_vins = ?', [etiquette, id_vins], (error2) => {
                    if (error2) throw error2
                })
            }
        })
    }

    // Check if a wine already exist in a user own ranking
    static checkIfAlreadyExistsInMyRanking(nom, millesime, couleur, id_membres, cb) {
        console.log('checkIfAlreadyExistsInMyRanking')
        connection.query(`select * from vins `
            + `where nom like ? `
            + `and millesime = ? `
            + `and couleur like ? ;`, 
        [nom, millesime, couleur], 
        (error, results) => {
            if (error) throw error
            if (results.length >= 1 )
            {
                let id_vins = results[0].id_vins
                connection.query('select * from classements_personnels_vins where id_membres = ? and id_vins = ? ;',
                    [id_membres, id_vins],
                    (error2, results2) => {
                        if (results2.length >= 1) {
                            cb('true')
                        } else {
                            cb('false')
                        }
                    }
                )
            } else {
                cb('false')
            }
        })
    }

    // Get the personnal list of wines ordered by ranking for one color
    static getPersonnalListOfTheseWines(couleur, id_membres, cb) {
        console.log('getPersonnalListOfTheseWines')
        connection.query(
            `select * from vins `+
            `join classements_personnels_vins on vins.id_vins = classements_personnels_vins.id_vins `+
            `where classements_personnels_vins.id_membres = ? and vins.couleur like ? and classements_personnels_vins.classements_personnels_vins is not null `+
            `order by classements_personnels_vins.classements_personnels_vins;`,
            [id_membres, couleur],
            (error, results) => {
                if (error) throw error
                // then, separate the received objects and put them in an array
                let nbrResultats = results.length
                let retour = []
                let objetTemporaire = {}
                for (var i = 0 ; i <= nbrResultats - 1 ; i++) {
                    objetTemporaire.id_vins = results[i].id_vins
                    objetTemporaire.etiquette = results[i].etiquette
                    retour.push(objetTemporaire)
                    objetTemporaire = new Object()
                }
                cb(retour)
            }
        )
    }

    // Get the general ranking of a wine color
    static getListOfTheseWines(couleur, cb) {
        console.log('getListOfTheseWines')
        connection.query('select * from vins where couleur like ? order by classement_general DESC', [couleur], (error, results) => {
            if (error) throw error
            // then, separate the received objects and put them in an array
            let nbrResultats = results.length
            let retour = []
            let objetTemporaire = {}
            for (var i = 0 ; i <= nbrResultats - 1 ; i++) {
                objetTemporaire.id_vins = results[i].id_vins
                objetTemporaire.etiquette = results[i].etiquette
                retour.push(objetTemporaire)
                objetTemporaire = new Object()
            }
            cb(retour)
        })
    }

    // add a wine to the personnal ranking
    static ajouterAuClassementPersonnel(id_vins, id_membres, couleur, classements_personnels_vins, cb) {
        console.log('ajouterAuClassementPersonnel')

        // Increment the personnal ranking of all wines beyond this one
        connection.query(
            `select * from vins `+
            `join classements_personnels_vins on vins.id_vins = classements_personnels_vins.id_vins `+
            `where classements_personnels_vins.id_membres = ? and vins.couleur like ? `+
            `order by classements_personnels_vins.classements_personnels_vins;`,
            [id_membres, couleur],
            (error, results) => {
                if (error) throw error
                for(var i = 0 ; i < results.length ; i++) {
                    if (results[i].classements_personnels_vins >= classements_personnels_vins) {
                        let nvoClassement = results[i].classements_personnels_vins + 1
                        let id_vin = results[i].id_vins
                        connection.query('update classements_personnels_vins set classements_personnels_vins = ? where id_vins = ? and id_membres = ? ', 
                            [nvoClassement, id_vin, id_membres], 
                            (error2) => {
                                if (error2) throw error2
                            }
                        )
                    }
                }
                // Update its own rank
                connection.query('update classements_personnels_vins set classements_personnels_vins = ? where id_vins = ? and id_membres = ? ', 
                    [classements_personnels_vins, id_vins, id_membres],
                    (error2) => {
                        if (error2) throw error2
                        cb('c\'est bat')
                    }
                )
            }
        )
    }
  
    // Get informations relative to 1 wine with its id and being logged in
    static getFicheVinWithIdBeingCo(id_vins, id_membres, cb) {
        console.log('getFicheVinWithIdBeingCo')
        connection.query(`select * from vins `
        + `join classements_personnels_vins on classements_personnels_vins.id_vins and vins.id_vins `
        + `where classements_personnels_vins.id_vins = ? and vins.id_vins = ? and classements_personnels_vins.id_membres = ? `
        + `limit 1;`, 
        [id_vins, id_vins, id_membres], 
        (error, results) => {
            if (error) throw error
            cb(results[0])
        })
    }

    // Get informations relative to 1 wine with its id and not being logged in
    static getFicheVinWithIdNotBeingCo(id_vins, cb) {
        console.log('getFicheVinWithIdNotBeingCo')
        connection.query('select * from vins where id_vins = ?', [id_vins], (error, results) => {
            if (error) throw error
            cb(results[0])
        })
    }

    // Add a wine to the general ranking
    static ajouterAuClassementGeneral(id_vins, id_membres, couleur, classements_personnels_vins, cb) {
        console.log('ajouterAuClassementGeneral')
        let gagnes = []
        let perdus = []
        let vinCourant
        let coteReelle
        let nvelleCoteVin2
        let mouvanceElo
        let query = ''
        let nbr_de_matchs

        // we needs the general ranking and the matchs number for each wine
        connection.query(
            `select * from vins `+
            `join classements_personnels_vins on vins.id_vins = classements_personnels_vins.id_vins `+
            `where classements_personnels_vins.id_membres = ? and vins.couleur like ? and classements_personnels_vins.classements_personnels_vins is not null `+
            `order by classements_personnels_vins.classements_personnels_vins;`,
            [id_membres, couleur],
            (error, results) => {
                if (error) throw error
                if (results.length === 1) {
                    // No need to do a match if it's the only one
                    cb('ayè c\'est dans la boite')
                } else {
                    // Distinguish the winner and the looser wines
                    for (var i = 0 ; i < results.length ; i++) {
                        if (results[i].classements_personnels_vins < classements_personnels_vins) {
                            gagnes.push(results[i])
                        } else if (results[i].classements_personnels_vins > classements_personnels_vins){
                            perdus.push(results[i])
                        }
                        else {
                            vinCourant = results[i]
                        }
                    }

                    // Calculate the reel value of this wine and the new value of the others
                    coteReelle = vinCourant.classement_general
                    gagnes.map(function(data) {
                        mouvanceElo = mouvementElo(vinCourant.nbr_de_matchs, vinCourant.classement_general, data.classement_general, true)
                        coteReelle += mouvanceElo
                        nvelleCoteVin2 = data.classement_general - mouvanceElo
                        nbr_de_matchs = data.nbr_de_matchs + 1
                        query += 'update vins set classement_general = ' + nvelleCoteVin2 + ',nbr_de_matchs = ' + nbr_de_matchs + ' where id_vins = ' + data.id_vins + ' ; '
                    })
                    
                    perdus.map(function(data) {
                        mouvanceElo = mouvementElo(vinCourant.nbr_de_matchs, vinCourant.classement_general, data.classement_general, false)
                        coteReelle += mouvanceElo
                        nvelleCoteVin2 = data.classement_general - mouvanceElo
                        nbr_de_matchs = data.nbr_de_matchs + 1
                        query += 'update vins set classement_general = ' + nvelleCoteVin2 + ',nbr_de_matchs = ' + nbr_de_matchs + ' where id_vins = ' + data.id_vins + ' ; '
                    })

                    // Insert the real ranking
                    nbr_de_matchs = vinCourant.nbr_de_matchs + results.length - 1
                    query += 'update vins set classement_general = ' + coteReelle + ',nbr_de_matchs = ' + nbr_de_matchs + ' where id_vins = ' + id_vins + ' ;'
                    connection.query(query, [], (error2) => {
                        if (error2) throw error2
                        cb('ayè c\'est dans la boite')
                    })
                }
            }
        )
    }
}

module.exports = FicheVin