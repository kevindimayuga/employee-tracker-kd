INSERT INTO department (department_name)
VALUES  ("Engineering"),
        ("Accounting"),
        ("Finance"),
        ("HR"),
        ("Marketing");

INSERT INTO job (title, salary, department_id)
VALUES  ("Engineer", 85000, 1),
        ("Senior Accountant", 120000, 1),
        ("Chief Financial Officer", 300000, 3),
        ("Human Resources Director", 200000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ('Theodore', 'Walsh', 1, 2),
        ('Heather', 'Gonzales', 1, null),
        ('Peggy', 'Murphy', 1, 2),
        ('John', 'Bailey', 2, 2),
        ('Dylan', 'Reed', 4, null);