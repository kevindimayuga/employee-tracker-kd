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
    // use JOIN to get manager name
    const sql =
        `SELECT
        e.id,
        e.first_name,
        e.last_name,
        r.title,
        d.department_name AS 'department',
        r.salary,
        CONCAT(m.first_name, ' ', m.last_name) AS 'manager'
    FROM
        employee AS e
    JOIN
        role AS r ON e.role_id = r.id
    JOIN
        department AS d ON r.department_id = d.id
    LEFT JOIN
        employee AS m ON e.manager_id = m.id;`;

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
const addEmployee = () => {
    // This will query the database and return all roles
    // because we need to know the roles to populate the choices
    db.query(`SELECT * FROM role`, (err, roleResults) => {
        if (err) {
            console.error('Error fetching all roles', err);
            return;
        }
        // This will prompt the user for the employee's information
        inquirer.prompt([
            {
                type: 'input',
                name: 'first_name',
                message: "What is the employee's first name?"
            },
            {
                type: 'input',
                name: 'last_name',
                message: "What is the employee's last name?"
            },
            {
                type: 'list',
                name: 'role_id',
                message: "What is the employee's role within the company?",
                // This will use the results from the query to
                //populate the choices
                choices: roleResults.map((role) => ({
                    name: role.title,
                    value: role.id
                }))
            }
        ]).then((answers) => {
            // This will fetch a list of employees to serve as manager choices
            db.query(`SELECT id, first_name, last_name FROM employee`, (err, managerResults) => {
                if (err) {
                    console.error('Error fetching employees for manager choices', err);
                    return;
                }

                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'manager_id',
                        message: "Who is the employee's manager?",
                        choices: managerResults.map((manager) => ({
                            name: `${manager.first_name} ${manager.last_name}`,
                            value: manager.id
                        }))
                    }
                ]).then((managerAnswers) => {
                    // This will add the manager_id to the answers object and start the insert query
                    answers.manager_id = managerAnswers.manager_id;
                    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                    VALUES (?, ?, ?, ?)`;
                    const params = [answers.first_name,
                    answers.last_name,
                    answers.role_id,
                    answers.manager_id
                    ];
                    // This will query the database and insert the new
                    // employee into the employee table
                    db.query(sql, params, (err, insertResult) => {
                        if (err) {
                            console.error('There is an error adding the employee', err);
                            return;
                        }
                        console.log('The employee has been added!');
                        // This will call the userSelection function to restart the server
                        userSelection();
                    });
                });
            });
        });
    });
};

// Update an Employee Role
const updateEmployeeRole = () => {
    // This will query the database and return all employees
    // because we need to know the employees to populate the choices
    db.query(`SELECT * FROM employee`, (err, employeeResults) => {
        if (err) {
            console.error('Error fetching all employees', err);
            return;
        }
        // This will prompt the user for the employee's information
        inquirer.prompt([
            {
                type: 'list',
                name: 'employee_id',
                message: "Which employee's role would you like to update?",
                // This will use the results from the query to
                //populate the choices
                choices: employeeResults.map((employee) => ({
                    name: `${employee.first_name} ${employee.last_name}`,
                    value: employee.id
                }))
            }
        ]).then((answers) => {
            // This will query the database and return all roles
            // because we need to know the roles to populate the choices
            db.query(`SELECT * FROM role`, (err, roleResults) => {
                if (err) {
                    console.error('Error fetching all roles', err);
                    return;
                }
                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'role_id',
                        message: "What is the employee's new role?",
                        // This will use the results from the query to
                        //populate the choices
                        choices: roleResults.map((role) => ({
                            name: role.title,
                            value: role.id
                        }))
                    }
                ]).then((roleAnswers) => {
                    // This will add the role_id to the answers object and start the update query
                    answers.role_id = roleAnswers.role_id;
                    const sql = `UPDATE employee SET role_id = ?
                    WHERE id = ?`;
                    const params = [answers.role_id, answers.employee_id];
                    // This will query the database and update the employee's role
                    db.query(sql, params, (err, updateResult) => {
                        if (err) {
                            console.error('There is an error updating the employee role', err);
                            return;
                        }
                        console.log('The employee role has been updated!');
                        // This will call the userSelection function to restart the server
                        userSelection();
                    });
                });
            });
        });
    });
};
// View All Roles
const viewAllRoles = () => {
    const sql = `SELECT
        e.first_name,
        e.last_name,
        r.id as 'role_id',
        r.title,
        d.department_name AS 'department',
        r.salary,
        CONCAT(m.first_name, ' ', m.last_name) AS 'manager'
    FROM
        employee AS e
    JOIN
        role AS r ON e.role_id = r.id
    JOIN
        department AS d ON r.department_id = d.id
    LEFT JOIN
        employee AS m ON e.manager_id = m.id;`;
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching all roles', err);
            return;
        }
        console.log('All Roles:');
        console.table(results);
        userSelection();
    });
};

// Add a Role
const addRole = () => {
    const sql = `SELECT * FROM department`;
    db.query(sql, (err, departmentResults) => {
        if (err) {
            console.error('Error fetching all departments', err);
            return;
        }
        inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message: "What is the role's title?"
            },
            {
                type: 'input',
                name: 'salary',
                message: "What is the role's salary?"
            },
            {
                type: 'list',
                name: 'department_id',
                message: "What is the role's department?",
                choices: departmentResults.map((department) => ({
                    name: department.department_name,
                    value: department.id
                }))
            }
        ]).then((answers) => {
            const sql = `INSERT INTO role (title, salary, department_id)
            VALUES (?, ?, ?)`;
            const params = [answers.title, answers.salary, answers.department_id];
            db.query(sql, params, (err, insertResult) => {
                if (err) {
                    console.error('There is an error adding the role', err);
                    return;
                }
                console.log('The role has been added!');
                userSelection();
            });
        });
    });
};

// View All Departments

// Add a Department

// This will call the userSelection function to start the server
userSelection();
