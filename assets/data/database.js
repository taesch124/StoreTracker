const mysql = require('mysql');

let createConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'bamazon'
});

let endConnection = createConnection.end();

module.exports = {
    createConnection: createConnection,
    endConnection: endConnection
}