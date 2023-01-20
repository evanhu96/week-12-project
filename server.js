const inquirer = require("inquirer");
const express = require("express");
// Import and require mysql2
const mysql = require("mysql2");
const { up } = require("inquirer/lib/utils/readline");

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: "localhost",
    // MySQL username,
    user: "root",
    // MySQL password
    password: "Ekh12518!",
    database: "business_db",
  },
  console.log(`Connected to the business_db database.`)
);
var roleL = [];
var employeeL = [];
var departmentL = [];
var managerL = [];
const getDepartments = () =>
  db.query(`SELECT * FROM departments`, (err, result) => {
    if (err) {
      console.log(err);
    }
    for (i in Object.values(result)) {
      departmentL.push(Object.values(result)[i].name);
    }
  });

const getRoles = () =>
  db.query(`SELECT * FROM roles`, (err, result) => {
    if (err) {
      console.log(err);
    }
    for (i in Object.values(result)) {
      roleL.push(Object.values(result)[i].name);
    }
  });

const getEmployees = () =>
  db.query(`SELECT * FROM employees`, (err, result) => {
    if (err) {
      console.log(err);
    }
    for (i in Object.values(result)) {
      employeeL.push(
        Object.values(result)[i].first_name +
          "," +
          Object.values(result)[i].last_name
      );
    }
  });

// JOIN TABLES
const getManagers = () =>
  db.query(`SELECT * FROM employees WHERE role_id = ?`, 1, (err, result) => {
    if (err) {
      console.log(err);
    }
    for (i in Object.values(result)) {
      managerL.push(
        Object.values(result)[i].first_name +
          "," +
          Object.values(result)[i].last_name
      );
    }
  });

//

const startQuestion = [
  {
    type: "list",
    message: "What would you like to do?",
    choices: [
      "view all departments",
      "view all roles",
      "view all employees",
      "Add Department",
      "Add Role",
      "Add Employee",
      "Update an Employee Role",
    ],
    name: "purpose",
  },
];
const departmentQ = [
  {
    type: "input",
    message: "What is the name of the department you would like to add?",
    name: "department",
  },
];
const roleQ = [
  {
    type: "input",
    message: "What is the name of the role?",
    name: "role",
  },
  {
    type: "input",
    message: "What is the salary of the role?",
    name: "salary",
  },
  {
    type: "list",
    message: "Which department does the role belong to?",
    choices: departmentL,
    name: "department",
  },
];
const employeeQ = [
  {
    type: "input",
    message: "What is the employees first name?",
    name: "first",
  },
  {
    type: "input",
    message: "What is the employees last name?",
    name: "last",
  },
  {
    type: "list",
    message: "What is the emplyee's role??",
    choices: roleL,
    name: "role",
  },
  {
    type: "list",
    message: "Who is the employees manager?",
    choices: managerL,
    name: "manager",
  },
];
const updateQ = [
  {
    type: "list",
    message: "Which employee would youlike to update?",
    choices: employeeL,
    name: "name",
  },
  {
    type: "list",
    message: "What role will you switch to?",
    choices: roleL,
    name: "role",
  },
];
// Hardcoded query: DELETE FROM course_names WHERE id = 3;

const viewDepartments = () =>
  db.query(`SELECT * FROM departments`, (err, result) => {
    if (err) {
      console.log(err);
    }
    console.log(result);
    setTimeout(() => {
      init();
    }, 2000);
  });
const viewRoles = () =>
  db.query(`SELECT * FROM roles`, (err, result) => {
    if (err) {
      console.log(err);
    }
    console.log(result);
    setTimeout(() => {
      init();
    }, 2000);
  });
const viewEmployees = () =>
  db.query(`SELECT * FROM employees`, (err, result) => {
    if (err) {
      console.log(err);
    }
    console.log(result);
    setTimeout(() => {
      init();
    }, 2000);
  });
const addDepartment = (department) =>
  db.query(
    `INSERT INTO departments (name) VALUES ('${department}')`,
    (err, result) => {
      if (err) {
        console.log(err);
      }
      init();
    }
  );
const addEmployee = (first, last, fk, manager) =>
  db.query(
    `INSERT INTO employees (first_name,last_name,role_id,manager) VALUES ('${first}','${last}','${fk}','${manager}')`,
    (err, result) => {
      if (err) {
        console.log(err);
      }
      init();
    }
  );
// Query database
const addRole = (role, salary, fk) =>
  db.query(
    `INSERT INTO roles (name,salary,department_id) VALUES ('${role}','${salary}','${fk}')`,
    (err, result) => {
      if (err) {
        console.log(err);
      }
      init();
    }
  );

const updateRole = (role, id) =>
  db.query(
    `UPDATE Employees
  SET role_id = '${role}'
  WHERE id = ${id};`,
    (err, result) => {
      if (err) {
        console.log(err);
      }
      init();
    }
  );

// Query database
async function init() {
  var begin = await inquirer.prompt(startQuestion);
  begin = begin.purpose;
  if (begin == "Add Department") {
    var input = await inquirer.prompt(departmentQ);
    addDepartment(input.department);
  } else if (begin == "Add Role") {
    var role = await inquirer.prompt(roleQ);
    var salary = role.salary;
    var department = departmentL.indexOf(role.department) + 1;
    role = role.role;
    addRole(role, salary, department);
  } else if (begin == "Add Employee") {
    var employee = await inquirer.prompt(employeeQ);
    var first = employee.first;
    var last = employee.last;
    var role = roleL.indexOf(employee.role) + 1;
    var manager = employee.manager;
    addEmployee(first, last, role, manager);
  } else if (begin == "view all departments") {
    viewDepartments();
  } else if (begin == "Update an Employee Role") {
    var upD = await inquirer.prompt(updateQ);
    var role = roleL.indexOf(upD.role) + 1;
    var id = employeeL.indexOf(upD.name) + 1;
    updateRole(role, id);
  } else if (begin == "view all employees") {
    viewEmployees();
  } else if (begin == "view all roles") {
    viewRoles();
  }
}

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

getDepartments();
getRoles();
getEmployees();
getManagers();
init();
