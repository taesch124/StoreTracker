const mysql = require('mysql');
const DB = require('./database');
const bcrypt = require('bcrypt');

const connection = DB.connection;

function getUserPermissionLevel(username, password, success, failure) {
    let query = `SELECT user_id,
    username,
    password,
    permission_level
    FROM users
    WHERE username = ?;`;
    connection.query(query, username, (error, results) => {
        if (error) {
            console.error(error);
            return;
        }

        if(bcrypt.compareSync(password, results[0].password)) {
            // Passwords match
            if (success) success(results);
        } else {
            // Passwords don't match
            console.log('Incorrect password!');
            if(failure) failure(results);
        }

        
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
            if (failure) failure();
        } else {
            let query = `INSERT INTO users SET ?`;
            let set = account;
            account.password = bcrypt.hashSync(account.password, 10);
            connection.query(query, set, (error, results) => {
                if (error) {
                    console.error(error);
                    return;
                }

                if(success) success(results);
            })
        }
    });  
}

function createSuperUserIfNotExists(callback) {
    let select = `SELECT username, password FROM users WHERE username = 'bob';`
    connection.query(select, (error, results) => {
        if (error) {
            console.error(error);
            return;
        }

        if (results.length === 0) {
            let superuser = {
                username: 'bob',
                password: bcrypt.hashSync('1234', 10),
                permission_level: 10000
            }
            let insert = `INSERT INTO users SET ?`;
            connection.query(insert, superuser, (error, results) => {
                if(error) {
                    console.error(error);
                    return;
                }

                callback(results);
            });
        } else {
            callback();
        }
    });
}


module.exports = {
    createAccount: createAccount,
    getUserPermissionLevel: getUserPermissionLevel,
    createSuperUserIfNotExists: createSuperUserIfNotExists
}