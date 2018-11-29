const Inquirer = require('inquirer');
const Products = require('./assets/data/productsData.js');

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
        Products.checkItemStock(amount, id);
    })
}

module.exports = {
    purchasePrompt: purchasePrompt,
    unitPurchasePrompt: unitPurchasePrompt
}