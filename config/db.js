var mysql      = require('mysql')
var connection = mysql.createConnection({
    host     : 'localhost',
    database : 'trivin',
    user     : 'tuto',
    password : 'tuto',
    dateStrings: 'date',
    multipleStatements: true
});
 
connection.connect()

module.exports = connection