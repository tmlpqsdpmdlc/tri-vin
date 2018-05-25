var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : brb6vf1az-mysql.services.clever-cloud.com,
  user     : u6uxk7x23cng8vtz,
  password : aHgHKDiwop0ajtWxr7p,
  database : brb6vf1az,
  dateStrings: 'date',
  multipleStatements: true
});
 
connection.connect();

module.exports = connection