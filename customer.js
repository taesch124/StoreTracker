const cTable = require('console.table');
const Products = require('./assets/data/productsData.js');
const Prompts = require('./prompts.js');

Products.getAllProductsDetails(Prompts.purchasePrompt);