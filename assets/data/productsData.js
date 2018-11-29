const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'bamazon'
});

function getAllProductsDetails(callback) {
    let query = 'SELECT * FROM products;';
    connection.query(query, (error, results) => {
        if (error) {
            console.error(error);
            return;
        }
    
        
        console.table(results);
        callback(results);
    });
    
}

function getProductDetails(id, callback) {
    let query = 'SELECT * FROM products WHERE item_id = ?';
    connection.query(query, id, (error, results) => {
        if(error) {
            console.error(error);
            return;
        }

        console.table(results);
        callback(id, results);
    });
}

function checkItemStock(amount, id, callback) {
    let query = 'SELECT price, stock_quantity FROM products WHERE item_id = ?';
    connection.query(query, id, (error, results) => {
        if (error) {
            console.error(error);
            return;
        }


        if(amount > results[0].stock_quantity) {
            console.log('Cannot buy more items than are in stock.');
        } else if (amount <= 0) {
            console.log('Amount must be greater than 0.');
        }else {
            console.log('Purchasing item. Your total is $' + (amount*results[0].price) );
        }
        connection.end();
    })
}

module.exports = {
    getAllProductsDetails: getAllProductsDetails,
    getProductDetails: getProductDetails,
    checkItemStock: checkItemStock
}