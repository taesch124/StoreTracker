const mysql = require('mysql');
const DB = require('./database');
const Cart = require('./cartData');

const connection = DB.connection;

function getAllProductsCustomer(callback) {
    let query = `SELECT P.item_id AS ID,
    P.product_name AS Name,
    D.department_name AS Department,
    P.price AS Price,
    P.stock_quantity AS Stock
    FROM products P
    INNER JOIN departments D
    ON P.department_id = D.department_id;`;
    connection.query(query, (error, results) => {
        if (error) {
            console.error(error);
            return;
        }
    
        
        console.table(results);
        if(callback) callback(results);
    });
}

function getAllProductsManager(callback) {
    let query = `SELECT P.item_id,
    P.product_name,
    D.department_name,
    P.price,
    P.stock_quantity,
    P.product_sales
    FROM products P
    INNER JOIN departments D
    ON P.department_id = D.department_id;`;
    connection.query(query, (error, results) => {
        if (error) {
            console.error(error);
            return;
        }
    
        
        console.table(results);
        if(callback) callback(results);
    });
}

function getAllProductsDetailsNoLog(callback) {
    let query = `SELECT P.item_id,
    P.product_name,
    D.department_id,
    D.department_name,
    P.price,
    P.stock_quantity
    FROM products P
    INNER JOIN departments D
    ON P.department_id = D.department_id;`;
    connection.query(query, (error, results) => {
        if (error) {
            console.error(error);
            return;
        }
    
        if(callback) callback(results);
    });
    
}

function getLowInventory(callback) {
    let query = `SELECT P.item_id,
    P.product_name,
    D.department_name,
    P.price,
    P.stock_quantity
    FROM products P
    INNER JOIN departments D
    ON P.department_id = D.department_id
    WHERE stock_quantity <= 5;`; 
    connection.query(query, (error, results) => {
        if(error) {
            console.error(error);
            return;
        }

        console.table(results);
        if(callback) callback(results);
    })
}

function getProductDetails(id, callback) {
    let query = 'SELECT * FROM products WHERE item_id = ?';
    connection.query(query, id, (error, results) => {
        if(error) {
            console.error(error);
            return;
        }

        console.table(results);
        if(callback) callback(id, results);
    });
}

function updateProductStock(id, stock, callback) {
    let query = 'SELECT item_id, stock_quantity, product_sales FROM products WHERE item_id = ?';
    let where = id;
    connection.query(query, where, (error, result) => {
        if (error) {
            console.error(error);
            return;
        }
        let query = 'UPDATE products SET ? WHERE ?';
        let set = {stock_quantity: result[0].stock_quantity + stock};
        let sales = result.product_sales;
        if(stock < 0) {
            set.product_sales = result[0].product_sales + Math.abs(stock);
        }
        let where = {item_id:id};

        connection.query(query, [set, where], (error, results) => {
            if(error) {
                console.error(error);
                return;
            }

            if(callback) callback(id, stock, results);
        });
    });
    
}

async function checkItemStock(currentAccount, id, stock, callback) {
    let query = 'SELECT product_name, price, stock_quantity FROM products WHERE item_id = ?';
    connection.query(query, id, (error, results) => {
        if (error) {
            console.error(error);
            return;
        }
        let product = results[0];

        if(stock < 0) {
            if( Math.abs(stock) > product.stock_quantity) {
                console.log('Cannot buy more items than are in stock.');
                callback();
            } else {
                console.log('Purchasing ' + product.product_name + '(s). Your total is $' + (Math.abs(stock) * product.price).toFixed(2) );
                Cart.addProductToCart(currentAccount, {item_id: id}, Math.abs(stock));
                updateProductStock(id, stock, callback);
            }
        } else {
            console.log('Adding ' + stock + ' units to inventory.');
            updateProductStock(id, stock, callback);
        }
        
        
    });
}

function addNewProduct(product, departmentName, callback) {
    let query = `SELECT department_id FROM departments WHERE department_name = ?`;
    let where = departmentName;
    connection.query(query, where, (error, results) => {
        if (error) {
            console.error(error);
            return;
        }

        if(results.length === 0) {
            console.log('No results found');
            return;
        }
        else if(results.length === 1) {
            product.department_id = results[0].department_id;
            let query = 'INSERT INTO products SET ?';
            connection.query(query, product, (error, result) => {
                if (error) {
                    console.error(error);
                    return;
                }

                console.log(product.peoduct_name + ' entered into database.');
                if(callback) callback(result);
            });
        } else {
            console.log('More than one department found.');
            return;
        }
    });
    
}


function closeConnection() {
    connection.end();
}

module.exports = {
    getAllProductsCustomer: getAllProductsCustomer,
    getAllProductsManager: getAllProductsManager,
    getAllProductsDetailsNoLog: getAllProductsDetailsNoLog,
    getLowInventory: getLowInventory,
    getProductDetails: getProductDetails,
    checkItemStock: checkItemStock,
    updateProductStock: updateProductStock,
    addNewProduct: addNewProduct,
    closeConnection: closeConnection
};