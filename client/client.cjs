require('dotenv').config();
const { Client } = require('pg');
const client = new Client(process.env.DATABASE_URL || 'postgres://localhost/2405-fbt-et-web-pt');

module.exports = client;