const cTable = require('console.table');
const Prompts = require('./prompts.js');
const User = require('./assets/data/userData');

User.createSuperUserIfNotExists(Prompts.accountPrompt);