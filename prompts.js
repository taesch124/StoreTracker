const Inquirer = require('inquirer');
const DB = require('./assets/data/database');
const Users = require('./assets/data/userData');
const Products = require('./assets/data/productsData');
const Departments = require('./assets/data/departmentData');

var loginAttempts = 0;
var currentAccount;

function accountPrompt() {
    Inquirer.prompt([
        {
            type: 'list',
            message: 'Login or Create Accout',
            choices: ['Login',
                        'Create Account',
                        'Quit'],
            name: 'action'
        }
    ])
    .then(answers => {
        switch(answers.action) {
            case 'Login':
                login();
                break;
            case 'Create Account':
                createAccount()
                break;
            case 'Quit':
                return;
            default: 
                break;
        }
    })
}

function login() {
    if (loginAttempts === 0) {
        console.log('Enter credentials to use application. (hint: usernname \'bob\' with password \'1234\' is a superuser)');
    }
    if (loginAttempts >= 4) {
        console.log('Too many attempts');
        DB.closeConnection();
        return;
    }
    Inquirer.prompt([
        {
            type: 'input',
            message: 'Enter username: ',
            name: 'username'
        },
        {
            type: 'input',
            message: 'Enter password: ',
            name: 'password'
        }
    ])
    .then(answers => {
        loginAttempts++;
        Users.getUserPermissionLevel(answers.username, answers.password, mainMenu);
    })
    
}

function createAccount() {
    Inquirer.prompt([
        {
            type: 'input',
            message: 'Enter username',
            name: 'username'
        },
        {
            type: 'input',
            message: 'Enter password',
            name: 'password'
        },
        {
            type: 'list',
            message: 'Choose permissions',
            choices: ['Customer', 'Manager', 'Supervisor'],
            name: 'permissions'
        }
    ])
    .then(answers => {
        let permissions = 1;
        if(answers.permissions === 'Customer') permissions = 1;
        else if(answers.permissions === 'Manager') permissions = 100;
        else if(answers.permissions === 'Supervisor') permissions = 1000;
        let account = { username: answers.username, password: answers.password, permission_level: permissions};
        Users.createAccount(account, login, accountPrompt);
    });
}

function mainMenu(results) {
    if ( results && results.length !== 1 ) {
        console.log('Invalid username or password');
        login();
        return;
    } else if (!currentAccount) {
        currentAccount = results[0];
    }
    let permissions = currentAccount.permission_level;


    Inquirer.prompt([
        {
            type: 'list',
            message: 'Which menu would you like to see:',
            choices: ['Customer',
                        'Manager',
                        'Supervisor',
                        'Login Again',
                        'Quit'],
            name: 'menuChoice'
        }
    ])
    .then(answers => {
        let choice = answers.menuChoice;
        switch(choice) {
            case 'Customer':
                if(permissions >= 1) customerMenu(currentAccount);
                else  {
                    console.log('You do not have customer permissions');
                    mainMenu();
                }
                break;
            case 'Manager':
                if(permissions >= 100) managerMenu(currentAccount);
                else {
                    console.log('You do not have manager permissions');
                    mainMenu();
                }
                break;
            case 'Supervisor':
                if(permissions >= 1000) supervisorMenu(currentAccount);
                else {
                    console.log('You do not have supervisor permissions');
                    mainMenu();
                }
                break;
            case 'Login Again':
                currentAccount = undefined;
                login();
                break;
            case 'Quit':
                DB.closeConnection();
                return;
            default:
                break;
        }
    });
}

function customerMenu(results) {
    Inquirer.prompt([{
        type: 'list',
        message: 'Choose an option:',
        choices: [ 'View Products',
                    'Purchase Product',
                    'Back'],
        name: 'managerAction'
    }])
    .then(answers => {
        let action = answers.managerAction;
        switch(action) {
            case 'View Products':
                Products.getAllProductsCustomer(customerMenu);
                break;
            case 'Purchase Product':
                Products.getAllProductsCustomer(purchasePrompt);
                break;
            case 'Back':
                mainMenu();
            default:
                break;
        }
    })
}

function purchasePrompt(products) {
    let ids = products.map(e => e.item_id.toString());
    //console.log(Products);
    Inquirer.prompt([
        {
            type: 'input',
            message: 'Enter ID of product to buy.',
            name: 'productId',
            validate: input => ids.includes(input) ? true : 'Enter a valid item id.'
        }
    ])
    .then((answers) => {
        Products.getProductDetails(answers.productId, unitPurchasePrompt);
    });
}

function unitPurchasePrompt(id) {
    Inquirer.prompt([
        {
            type: 'input',
            message: 'How many units would you like to buy.',
            name: 'purchaseAmount',
            validate: input => parseInt(input) ? true : 'Must be an integer.'
        }
    ])
    .then((answers) => {
        let amount = parseInt(answers.purchaseAmount);
        Products.checkItemStock(id, -amount, purchaseAgainPrompt);
    })
}

function purchaseAgainPrompt() {
    Inquirer.prompt([
        {
            type: 'confirm',
            message: 'Would you like to purchase another product?',
            name: 'purchaseAgain'
        }
    ])
    .then(answers => {
        if(answers.purchaseAgain) {
            Products.getAllProductsCustomer(purchasePrompt);
        } else {
            customerMenu();
        }
    })
}

function managerMenu(results) {
    Inquirer.prompt([{
        type: 'list',
        message: 'Choose an option:',
        choices: ['View Available Products',
                    'View Low Inventory',
                    'Add To Inventory',
                    'Add New Product',
                    'Back'],
        name: 'managerAction'
    }])
    .then(answers => {
        let action = answers.managerAction;
        switch(action) {
            case 'View Available Products':
                Products.getAllProductsManager(managerMenu);
                break;
            case 'View Low Inventory':
                Products.getLowInventory(managerMenu);
                break;
            case 'Add To Inventory':
                Products.getAllProductsManager(addInventoryPrompt)
                break;
            case 'Add New Product':
                Departments.getDepartmentDetails(addNewProductPrompt);
                break;
            case 'Back':
                mainMenu();
            default:
                break;
        }
    })
}

function addInventoryPrompt(departments) {
    let ids = departments.map(e => e.item_id.toString());
    //console.log(Products);
    Inquirer.prompt([
        {
            type: 'input',
            message: 'Enter ID of product to update.',
            name: 'productId',
            validate: input => ids.includes(input) ? true : 'Enter a valid item id.'
        },
        {
            type: 'input',
            message: 'How many are being added:',
            name: 'addAmount',
            validate: input => (parseInt(input) && parseInt(input) > 0) ? true : 'Please enter a number over 0.'
        }
    ])
    .then((answers) => {
        Products.checkItemStock(answers.productId, parseInt(answers.addAmount), managerMenu);
    });
}

function addNewProductPrompt(products) {
    let departments = products.map(e => e.department_id.toString());
    console.log(departments);
    Inquirer.prompt([
        {
            type: 'input',
            message: 'Enter name of product: ',
            name: 'name'
        },
        {
            type: 'list', 
            message: 'Choose department id:',
            choices: departments,
            name: 'department',
            validate: input => departments.includes(input) ? true : 'Please pick a valid department'
        },
        {
            type: 'input',
            message: 'Enter product price: ',
            name: 'price',
            validate: input => parseFloat(input) > 0 ? true : 'Enter a number greater than 0'
        },
        {
            type: 'input',
            message: 'How many are currently in stock: ',
            name: 'stock',
            validate: input => parseInt(input) > 0 ? true : 'Enter an integer greater than 0'
        }
    ]).then(answers => {
        console.log(answers);
        Products.addNewProduct(answers.name,
            parseInt(answers.department),
            answers.price,
            answers.stock,
            managerMenu);
        });
}

function supervisorMenu(results) {
    Inquirer.prompt([{
        type: 'list',
        message: 'Choose an option:',
        choices: [ 'View Departments',
                    'View Product Sales By Department',
                    'Create New Department',
                    'Back'],
        name: 'managerAction'
    }])
    .then(answers => {
        let action = answers.managerAction;
        switch(action) {
            case 'View Departments':
                Departments.getDepartmentDetails(supervisorMenu);
                break;
            case 'View Product Sales By Department':
                Departments.getProductSalesByDepartment(supervisorMenu);
                break;
            case 'Create New Department':
                Departments.getDepartmentDetails(addNewDepartment);
                break;
            case 'Back':
                mainMenu();
            default:
                break;
        }
    })
}

function addNewDepartment(departments) {
    let names = departments.map(e => e.department_name);
    Inquirer.prompt([
        {
            type: 'input',
            message: 'Enter department name:',
            name: 'name',
            validate: input => !names.includes(input) ? true : 'Department already exists'
        },
        {
            type: 'input',
            message: 'What are the overhead costs:',
            name: 'overhead',
            validate: input => parseFloat(input) > 0 ? true : 'Must be a number greater than 0'
        }
    ])
    .then(answers => {
        Departments.addNewDepartment(answers.name, parseFloat(answers.overhead), supervisorMenu);
    });

}

module.exports = {
    accountPrompt: accountPrompt,
    login: login,
    mainMenu: mainMenu,
    customerMenu: customerMenu,
    managerMenu: managerMenu,
    supervisorMenu: supervisorMenu
}