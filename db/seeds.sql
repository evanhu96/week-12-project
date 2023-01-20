INSERT INTO departments (name)
VALUES ("sales"),
       ("service"),
       ("finance"),
       ("tech");

INSERT INTO roles (name,salary,department_id)
VALUES ("manager",100000,1),
       ("engineer",80000,4),
       ("intern",20,3),
       ("accountant",70000,2);

INSERT INTO employees (first_name,last_name,role_id,manager)
VALUES ("evan","hughes", 1,'Evan Hughes'),
       ("Kevin","Hart",  2,'Evan Hughes' ),
       ("John","Finance",3,'Evan Hughes');

