const mysql = require('mysql');
const DB = require('./database');

const connection = DB.connection;

function getUserCart(user, callback) {
    let select = `SELECT U.username AS Username,
    P.product_name AS Product,
    C.quantity AS Quantity,
    CONCAT("$", (P.price * C.quantity)) AS  "Product Total"
    FROM cart C
    INNER JOIN users U
    ON C.user_id = U.user_id
    INNER JOIN products P
    ON C.item_id = P.item_id
    WHERE U.user_id = '${user.user_id}';`;
    connection.query(select,  (error, results) => {
        if (error) {
            console.error(error);
            return;
        }

        if (results.length > 0) {
             console.table(results);
        } else {
            console.log('Nothing in cart yet.');
        }
        if(callback) callback(results);
    });
}

function getCartTotal(user, callback, empty) {
    let select = `SELECT SUM(P.price * C.quantity) AS  "ProductTotal"
    FROM cart C
    INNER JOIN users U
    ON C.user_id = U.user_id
    INNER JOIN products P
    ON C.item_id = P.item_id
    WHERE U.user_id = ${user.user_id};`;
    connection.query(select, (error, results) => {
        if(error) {
            console.error(error);
            return;
        }

        if(results[0].ProductTotal !== null) {
            console.log('Your total is $' + results[0].ProductTotal + '.');
            if(callback) callback(results);
        }
        else {
            console.log('Nothing in cart yet.');
            if(empty) empty(results);
        }
        
    });
}

function addProductToCart(user, product, quantity, callback) {
    let insert = `INSERT INTO cart SET ?;`;
    let set = {
        user_id: user.user_id,
        item_id: product.item_id,
        quantity: quantity
    };
    connection.query(insert, set, (error, results) => {
        if (error) {
            console.error(error);
            return;
        }

        if (callback) callback(results);
    });
}

function emptyCartByUser(user, callback) {
    let query = `DELETE FROM cart WHERE user_id = ${user.user_id}`;
    connection.query(query, (error, results) => {
        if(error) {
            console.error(error);
            return;
        }

        console.log(user.username + '\'s cart has been emptied.');
        if (callback) callback(results);
    })
}

module.exports = {
    getUserCart: getUserCart,
    getCartTotal: getCartTotal,
    addProductToCart: addProductToCart,
    emptyCartByUser: emptyCartByUser
}