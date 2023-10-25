-- This will insert data about each department into the database
USE employees_db;
INSERT INTO department (department_name)
VALUES ("Marketing"),
       ("Finance"),
       ("Human Resources"),
       ("IT"),
       ("Accounting");
-- This will insert data about each role into the database
INSERT INTO role (title, salary, department_id)
VALUES ("Marketing Manager", 100000, 1),
       ("Sales Associate", 50000, 1),
       ("Finance Manager", 150000, 2),
       ("Financial Analyst", 75000, 2),
       ("Human Resources Manager", 125000, 3),
       ("Human Resources Associate", 60000, 3),
       ("IT Manager", 175000, 4),
       ("Software Developer", 85000, 4),
       ("Accounting Manager", 200000, 5),
       ("Audit Accountant", 100000, 5);
-- This will insert data about each employee into the database
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Zach", "Lavine", 1, 1),
       ("Demar", "DeRozan", 2, 1),
       ("DJ", "Moore", 3, 2),
       ("Justin", "Fields", 4, 2),
       ("Mira", "Donavan", 5, 3),
       ("Sarah", "Moss", 6, 3),
       ("Kira", "Apple", 7, 4),
       ("Tyreek", "Hill", 8, 4),
       ("Malia", "Anderson", 9, 5),
       ("AJ", "Brown", 10, 5);