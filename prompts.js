const Inquirer = require('inquirer');
const Products = require('./assets/data/productsData');

var getDetails = Products.getProductDetails;

function purchasePrompt(products) {
    console.log(products);
    let ids = products.map(e => e.item_id.toString());
    console.log(ids);

    Inquirer.prompt([
        {
            type: 'input',
            message: 'Enter ID of product to buy.',
            name: 'productId',
            validate: input => ids.includes(input) ? true : 'Enter a valid item id.'
        }
    ])
    .then((answers) => {
        console.log(answers.productId + ' chosen');
        console.log(Products, this, getDetails);
        Products.getProductDetails(answers.productId);
    });
}

module.exports = {
    purchasePrompt: purchasePrompt
}