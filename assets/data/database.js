const mysql = require('mysql');

let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'bamazon'
});


function closeConnection () {
    connection.end();
}

module.exports = {
    closeConnection: closeConnection,
    connection
}