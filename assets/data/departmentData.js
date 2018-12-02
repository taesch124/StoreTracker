const mysql = require('mysql');
const DB = require('./database');

const connection = DB.connection;


function getDepartmentDetails(callback) {
    let query = `SELECT department_id,
    department_name
    FROM departments;`;
    connection.query(query, (error, results) => {
        if (error) {
            console.error(error);
            return;
        }
    
        
        console.table(results);
        if(callback) callback(results);
    });
}

function addNewDepartment(name, overhead, callback) {
    let query = `INSERT INTO departments SET ?;`;
    let set = {
        department_name: name,
        over_head_costs: overhead
    };

    connection.query(query, set, (error, results) => {
        if (error) {
            console.error(error);
            return;
        }

        if(callback) callback(results);
    });

}

function getProductSalesByDepartment(callback) {
    let query = `SELECT D.department_id,
    D.department_name,
    D.over_head_costs,
    COALESCE(P.product_sales, 0) AS product_sales,
    COALESCE(P.product_sales, 0) - D.over_head_costs AS total_profit
    FROM departments D
    LEFT OUTER JOIN (SELECT DP.department_id,
                COALESCE(SUM(PR.price * PR.product_sales), 0) AS product_sales
                FROM departments DP
                LEFT OUTER JOIN products PR
                ON PR.department_id = DP.department_id
                GROUP BY PR.department_id) P
    ON D.department_id = P.department_id;`;
    connection.query(query, (error, results) => {
        if (error) {
            console.error(error);
            return;
        }
        console.table(results);
        if(callback) callback(results);
    })
}

function closeConnection() {
    connection.end();
}

module.exports = {
    getDepartmentDetails:getDepartmentDetails,
    addNewDepartment: addNewDepartment,
    getProductSalesByDepartment: getProductSalesByDepartment,
    closeConnection: closeConnection
}