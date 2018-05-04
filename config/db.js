var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'tuto',
  password : 'tuto',
  database : 'trivin'
});
 
connection.connect();

module.exports = connection