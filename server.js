// import necessary packages
const express = require('express');
const mysql = require('mysql2');

// set up port and express app
const PORT = process.env.PORT || 3001;
const app = express();

// set up and connect to database
const db = mysql.createConnection(
    {
        // use a .env file to pull in sensitive data
        host: 'localhost',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    },
    console.log(`Connected to the ${process.env.DB_NAME} database.`)
);