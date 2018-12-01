const mysql = require('mysql');
const DB = require('./database');

const connection = DB.connection;

function getAllProductsCustomer(callback) {
    let query = `SELECT P.item_id,
    P.product_name,
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
    
        
        console.table(results);
        if(callback) callback(results);
    });
}

function getAllProductsManager(callback) {
    let query = `SELECT P.item_id,
    P.product_name,
    D.department_id,
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
    D.department_id,
    D.department_name,
    P.price,
    P.stock_quantity,
    P.product_sales
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
        console.log(result);
        let query = 'UPDATE products SET ? WHERE ?';
        let set = {stock_quantity: result[0].stock_quantity + stock};
        let sales = result.product_sales;
        if(stock < 0) {
            console.log(sales);
            set.product_sales = result[0].product_sales + Math.abs(stock);
        }
        console.log(set);
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

function checkItemStock(id, stock, callback) {
    let query = 'SELECT product_name, price, stock_quantity FROM products WHERE item_id = ?';
    connection.query(query, id, (error, results) => {
        if (error) {
            console.error(error);
            return;
        }
        let product = results[0];

        if(stock < 0) {
            if( (-1 * stock) > product.stock_quantity) {
                console.log('Cannot buy more items than are in stock.');
                callback();
            } else {
                console.log('Purchasing ' + product.product_name + '(s). Your total is $' + (-1 * stock * product.price).toFixed(2) );
                updateProductStock(id, stock, callback);
            }
        } else {
            console.log('Adding ' + stock + ' units to inventory.');
            updateProductStock(id, stock, callback);
        }
        
        
    });
}

function addNewProduct(name, department, price, stock, callback) {
    let query = 'INSERT INTO products SET ?';
    let set = {
        product_name: name,
        department_id: department,
        price: price,
        stock_quantity: stock,
        product_sales: 0
    };
    connection.query(query, set, (error, result) => {
        if (error) {
            console.error(error);
            return;
        }

        console.log(name + ' entered into database.');
        if(callback) callback(result);
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