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

}

module.exports = FicheMembre