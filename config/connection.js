// Import and require mysql2
const mysql = require('mysql2');

require('dotenv').config();

const connection = mysql.createConnection(
    {
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: process.env.DB_PASSWORD,
        database: 'employees_db'
    },
    console.log(`Connected to the employees_db database.`)
);

module.exports = connection;