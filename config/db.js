var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : process.env.MYSQL_ADDON_HOST,
  database : process.env.MYSQL_ADDON_DB,
  user     : process.env.MYSQL_ADDON_USER,
  password : process.env.MYSQL_ADDON_PASSWORD,
  dateStrings: 'date',
  multipleStatements: true
});
 
connection.connect();

module.exports = connection