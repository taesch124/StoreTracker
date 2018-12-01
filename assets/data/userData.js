const mysql = require('mysql');
const DB = require('./database');

const connection = DB.connection;

function getUserPermissionLevel(username, password, callback) {
    let query = `SELECT permission_level
    FROM users
    WHERE username = ?
    AND password = ?;`;
    connection.query(query, [username, password], (error, results) => {
        if (error) {
            console.error(error);
            return;
        }

        if (callback) callback(results)
    });
}

function createAccount(account, success, failure) {
    console.log(account);
    let query = `SELECT username FROM users WHERE username = ?`;
    let where = account.username;
    connection.query(query, where, (error, results) => {
        if(error) {
            console.error(error);
            return;
        }

        if (results.length > 0) {
            console.log('Username already exists');
            failure();
        } else {
            let query = `INSERT INTO users SET ?`;
            let set = account;
            connection.query(query, set, (error, results) => {
                if (error) {
                    console.error(error);
                    return;
                }

                success(results);
            })
        }
    });
    
    
}
module.exports = {
    createAccount: createAccount,
    getUserPermissionLevel: getUserPermissionLevel
}