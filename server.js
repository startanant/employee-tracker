//Dependencies
const inquirer = require("inquirer");
const mysql = require('mysql');


//connection to my sql
class Database {
    constructor(config) {
        this.connection = mysql.createConnection(config);
    }
    query(sql, args = []) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, args, (err, rows) => {
                if (err)
                    return reject(err);
                resolve(rows);
            });
        });
    }
    close() {
        return new Promise((resolve, reject) => {
            this.connection.end(err => {
                if (err)
                    return reject(err);
                resolve();
            });
        });
    }
}

const db = new Database({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "mysqlmysql",
    database: "employee_tracker"
});

startPrompts();

async function startPrompts() {
    const startChoices = ["Add employee", "Add department", "Add role", "View employees", "View departments", "View roles", "View employees by Role", "View employees by Department", "View all", "Update Employee", "Remove Employee"];
    const firstQ = await inquirer.prompt([
        {
            type: "list",
            name: "userChoice",
            message: "What would you like to do?",
            choices: startChoices
        }
    ]);

    switch (firstQ.userChoice) {
        case ("Add employee"):
            return addEmployee();
        case ("Add department"):
            return addDepartment();
        case ("Add role"):
            return addRole();
        case ("View employees"):
            return viewEmployees();
        case ("View departments"):
            return viewDepartment();
        case ("View roles"):
            return viewRoles();
        case ("View employees by Role"):
            return viewEmployeesByRoles();
        case ("View employees by Department"):
            return viewEmployeesByDepartment();
        case ("View all"):
            return viewAll();
        case ("Update Employee"):
            return updateEmployee();
        case ("Remove Employee"):
            return removeEmployee();
    };
}

//-------- ADD SECTION ------------//
async function addEmployee() {

    let roleArray = await db.query(`SELECT RoleId, title FROM role `);
    roleArray = JSON.stringify(roleArray);
    roleArray = JSON.parse(roleArray);

    let roleChoices = [];
    for (var i = 0; i < roleArray.length; i++) {
        roleChoices.push(roleArray[i].title);
    }

    // console.log(roleChoices);

    const employeeAdded = await inquirer.prompt([
        {
            type: "input",
            name: "empFirstName",
            message: "What is the employee's first name?",
        },
        {
            type: "input",
            name: "empLastName",
            message: "What is the employee's last name?",
        },
        {
            type: "list",
            name: "roleId",
            message: "What is the employee's role?",
            choices: roleChoices

        },
        {
            type: "input",
            name: "managerId",
            message: "What is the manager id number? "
        }
    ]);


    for (var i = 0; i < roleArray.length; i++) {
        if (employeeAdded.roleId == roleArray[i].title) {
            const insertRow = await db.query('INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES(?,?,?,?)',
                [employeeAdded.empFirstName, employeeAdded.empLastName, roleArray[i].RoleId, employeeAdded.managerId]
            );
            break;
        }
    }

    console.log(`${employeeAdded.empFirstName} ${employeeAdded.empLastName} has been added `);
    startAgain();
}

async function addDepartment() {
    const departmentAdded = await inquirer.prompt([
        {
            type: "input",
            name: "depName",
            message: "Provide the name of the department",
        }
    ]);

    const insertRow = await db.query(
        'INSERT INTO department(name) VALUES(?)',
        [departmentAdded.depName]
    );

    console.log(`${departmentAdded.depName} has been added`);
    startAgain();
}

async function addRole() {
    let depArray = await db.query(`SELECT DepId, name FROM department `);
    depArray = JSON.stringify(depArray);
    depArray = JSON.parse(depArray);

    let depChoices = [];
    for (var i = 0; i < depArray.length; i++) {
        depChoices.push(depArray[i].name);
    }

    console.log(depChoices);
    const roleAdded = await inquirer.prompt([
        {
            type: "input",
            name: "roleName",
            message: "Provide the role name.",
        },
        {
            type: "input",
            name: "salary",
            message: "What is the salary for this role?",
        },
        {
            type: "list",
            name: "deptId",
            message: "What is the name of the department?",
            choices: depChoices
        }
    ]);

    for (var i = 0; i < depArray.length; i++) {
        if (roleAdded.deptId == depArray[i].name) {
            const insertRow = await db.query('INSERT INTO role(title, yearly_salary, department_id ) VALUES(?,?,?)',
                [roleAdded.roleName, roleAdded.salary, depArray[i].DepId]);
            break;
        }
    }

    console.log(`${roleAdded.roleName} with salary of $${roleAdded.salary} has been added`)
    startAgain();
}

//-------- VIEW SECTION ------------//
async function viewEmployees() {
    const sqlTable = await db.query("Select * FROM employee");
    console.table(sqlTable);

    startAgain();

};

async function viewDepartment() {
    const sqlTable = await db.query("SELECT * FROM department");
    console.table(sqlTable);

    startAgain();

};

async function viewRoles() {
    const sqlTable = await db.query("SELECT * FROM role");
    console.table(sqlTable);

    startAgain();

};

async function viewEmployeesByRoles() {
    const sqlTable = await db.query("SELECT first_name, last_name, title, yearly_salary FROM employee LEFT JOIN role ON employee.role_id = role.RoleId");
    console.table(sqlTable);

    startAgain();
};

async function viewEmployeesByDepartment() {
    const sqlTable = await db.query("SELECT name, first_name, last_name from department LEFT JOIN role ON role.department_id = department.DepId LEFT JOIN employee ON employee.role_id = role.RoleId ");
    console.table(sqlTable);

    startAgain();
};

async function viewAll() {
    const sqlTable = await db.query("SELECT first_name, last_name, title, yearly_salary,name FROM employee LEFT JOIN role ON employee.role_id = role.RoleId LEFT JOIN department ON role.department_id = department.DepId");
    console.table(sqlTable);
    startAgain();

};

//-------- UPDATE SECTION ------------//
async function updateEmployee() {
    let roleUpdate = await db.query(`SELECT RoleId, title FROM role `);
    roleUpdate = JSON.stringify(roleUpdate);
    roleUpdate = JSON.parse(roleUpdate);

    let roleChoices = [];

    for (var i = 0; i < roleUpdate.length; i++) {
        roleChoices.push(roleUpdate[i].title);
    }

    const updateEmployeeRole = await inquirer.prompt([
        {
            type: "input",
            name: "firstName",
            message: "Provide the first name of the employee you would like to update.",
        },
        {
            type: "list",
            name: "updateRoleId",
            message: "What do you want to update the employee's role to?",
            choices: roleChoices
        }
    ]);


    usersName = updateEmployeeRole.firstName;
    updateRole = updateEmployeeRole.updateRoleId;

    for (var i = 0; i < roleUpdate.length; i++) {
        if (updateRole == roleUpdate[i].title) {
            const insertRow = await db.query("UPDATE employee SET role_id=? WHERE first_name=?", [roleUpdate[i].RoleId, usersName]);
            break;
        }
    }
    console.log(`${usersName}'s role has been updated.`)
    startAgain();
}

//--------- DELETE SECTION
async function removeEmployee() {
    let employeeName = await db.query(`SELECT first_name FROM employee `);
    employeeName = JSON.stringify(employeeName);
    employeeName = JSON.parse(employeeName);

    let employeeChoices = [];

    for (var i = 0; i < employeeName.length; i++) {
        employeeChoices.push(employeeName[i].first_name);
    }

    // console.log(employeeChoices);

    const removeSql = await inquirer.prompt([
        {
            type: "list",
            name: "empFirstName",
            message: "Who would you like to remove?",
            choices: employeeChoices
        }
    ]);

    for (var i = 0; i < employeeChoices.length; i++) {
        if (removeSql.empFirstName == employeeName[i].first_name) {
            const deletedEmp = await db.query("DELETE FROM employee WHERE first_name=?", [removeSql.empFirstName]);
            break;
        }
    }

    console.log(`${removeSql.empFirstName} has been removed.`);
    startAgain();
}

async function startAgain() {
    const askUser = await inquirer.prompt([
        {
            type: "input",
            message: "Start Again? y/n?",
            name: "userConfirm"
        }
    ]);

    if (askUser.userConfirm == "y") {
        return startPrompts();
    } else {
        process.exit();
    }
}


