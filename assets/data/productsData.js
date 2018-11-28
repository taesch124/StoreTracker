const mysql = require('mysql');
const Prompts = require('./../../prompts.js');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'bamazon'
});

function getAllProductsDetails() {
    connection.connect();
    let query = 'SELECT * FROM products;';
    connection.query(query, (error, results) => {
        if (error) {
            console.error(error);
            return;
        }
    
        console.table(results);
        Prompts.purchasePrompt(results);
    });
    connection.end();
}

function getProductDetails(id) {
    connection.connect();
    let query = 'SELECT * FROM products WHERE item_id = ?';
    connection.query(query, id, (error, results) => {
        if(error) {
            console.error(error);
            return;
        }

        console.table(results);
    });
    connection.end();
}

module.exports = {
    getAllProductsDetails: getAllProductsDetails,
    getProductDetails: getProductDetails
}