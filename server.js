// import necessary packages
const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');

// import dotenv package to use .env file
require('dotenv').config();

// set up port and express app
const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

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

// This will start the server after the connection to the database is made
// and prompt the user for what they would like to do
const userSelection = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'userSelection',
            message: 'What would you like to do?',
            choices: [
                'View All Employees',
                'Add an Employee',
                'Update an Employee Role',
                'View All Roles',
                'Add a Role',
                'View All Departments',
                'Add a Department',
                'Exit'
            ]
        }
        // This will then take the user's selection and run the appropriate function
    ]).then((answers) => {
        const selection = answers.userSelection;
        if (selection === 'View All Employees') {
            viewAllEmployees();
        } else if (selection === 'Add an Employee') {
            addEmployee();
        } else if (selection === 'Update an Employee Role') {
            updateEmployeeRole();
        } else if (selection === 'View All Roles') {
            viewAllRoles();
        } else if (selection === 'Add a Role') {
            addRole();
        } else if (selection === 'View All Departments') {
            viewAllDepartments();
        } else if (selection === 'Add a Department') {
            addDepartment();
        } else if (selection === 'Exit') {
            console.log('Thanks for using the Employee Tracker!');
            db.end();
        }
    });
};

// View All Employees
const viewAllEmployees = () => {
    const sql = `SELECT * FROM employee`;
    // This will query the database and return all employees
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching all employees', err);
            return;
        }
        console.log('All Employees:');
        // This will display all employees in a table
        console.table(results);
        // This will call the userSelection function to restart the server
        userSelection();
    });
};

// Add an Employee

// Update an Employee Role

// View All Roles

// Add a Role

// View All Departments

// Add a Department

// Exit

// This will call the userSelection function to start the server
userSelection();
