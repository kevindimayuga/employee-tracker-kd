DROP DATABASE IF EXISTS employees_db;

CREATE DATABASE employees_db;

USE employees_db;

-- This will create the department table and it will have an id column that is an integer
-- and is the primary key and it will auto increment. It will also have a department_name
-- column that is a varchar and is not null.
CREATE TABLE
    department (
        id INTEGER PRIMARY KEY AUTO_INCREMENT,
        department_name VARCHAR(30) NOT NULL
    );

-- Similarly, this will create a role table
CREATE TABLE
    role (
        id INTEGER PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(30) NOT NULL,
        salary DECIMAL(10, 2) NOT NULL,
        department_id INTEGER,
        -- This will reference the department table and the id
        -- column in the department table
        Foreign Key (department_id) REFERENCES department(id)
        ON DELETE CASCADE
    );

-- Similarly, this will create an employee table
CREATE TABLE
    employee (
        id INTEGER PRIMARY KEY AUTO_INCREMENT,
        first_name VARCHAR(30) NOT NULL,
        last_name VARCHAR(30) NOT NULL,
        role_id INTEGER,
        manager_id INTEGER,
        -- This will reference the role table and the id 
        -- column in the role table
        Foreign Key (role_id) REFERENCES role(id)
        ON DELETE CASCADE,
        Foreign Key (manager_id) REFERENCES employee(id)
        ON DELETE CASCADE
    );