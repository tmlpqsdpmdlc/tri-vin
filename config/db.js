var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : MYSQL_ADDON_HOST,
  user     : MYSQL_ADDON_USER,
  password : MYSQL_ADDON_PASSWORD,
  database : MYSQL_ADDON_DB,
  dateStrings: 'date',
  multipleStatements: true
});
 
connection.connect();

module.exports = connection