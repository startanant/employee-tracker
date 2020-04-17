DROP DATABASE IF EXISTS employee_tracker;

CREATE DATABASE employee_tracker;
USE employee_tracker;

CREATE TABLE department (
	DepId INT PRIMARY KEY auto_increment,
	name VARCHAR(30) NOT NULL
);

CREATE TABLE role (
	RoleId INT PRIMARY KEY auto_increment ,
	title VARCHAR(30) NOT NULL,
	yearly_salary DECIMAL,
	department_id INT,
	FOREIGN KEY (department_id) REFERENCES department(DepId)
);

CREATE TABLE employee (
	employee_id INT PRIMARY KEY auto_increment,
	first_name VARCHAR(30) NOT NULL ,
	last_name VARCHAR(30) NOT NULL,
	role_id INT NOT NULL,
	manager_id INT,
	FOREIGN KEY (role_id) REFERENCES role(RoleId)
	-- FOREIGN KEY (manager_id) REFERENCES role(RoleId) 
);

INSERT INTO department(name) VALUES("IT");
INSERT INTO department(name) VALUES("HR");
INSERT INTO department(name) VALUES("Accounting");
INSERT INTO department(name) VALUES("Engineering");
INSERT INTO department(name) VALUES("Sales");

INSERT INTO role(title, yearly_salary, department_id) VALUES("Financial Controller", "60000", "3");
INSERT INTO role(title, yearly_salary, department_id) VALUES("Accountant", "55947", "3");
INSERT INTO role(title, yearly_salary, department_id) VALUES("Software engineer", "60000", "4");
INSERT INTO role(title, yearly_salary, department_id) VALUES("Civil Engineer", "86640", "4");
INSERT INTO role(title, yearly_salary, department_id) VALUES("Technical Support", "84411", "1");
INSERT INTO role(title, yearly_salary, department_id) VALUES("Data Analyst", "55697", "1");
INSERT INTO role(title, yearly_salary, department_id) VALUES("Computer Technician", "29250", "1");
INSERT INTO role(title, yearly_salary, department_id) VALUES("IT Manager", "109633", "1");
INSERT INTO role(title, yearly_salary, department_id) VALUES("HR Tech Lead", "115220", "2");
INSERT INTO role(title, yearly_salary, department_id) VALUES("Staffing specialist", "49967", "2");
INSERT INTO role(title, yearly_salary, department_id) VALUES("HR representative", "58890", "2");
INSERT INTO role(title, yearly_salary, department_id) VALUES("HR analyst", "73733", "2");
INSERT INTO role(title, yearly_salary, department_id) VALUES("Sales Director", "95741", "5");
INSERT INTO role(title, yearly_salary, department_id) VALUES("Sales Analyst", "95741", "5");
INSERT INTO role(title, yearly_salary, department_id) VALUES("Sales Engineer", "65469", "5");
INSERT INTO role(title, yearly_salary, department_id) VALUES("Sales Consultant", "41104", "5");
INSERT INTO role(title, yearly_salary, department_id) VALUES("Sales Trainer", "64054", "5");


INSERT INTO employee(first_name, last_name, role_id) VALUES("John", "Smith", "3");
INSERT INTO employee(first_name, last_name, role_id) VALUES("Jack", "Dawson", "9");
INSERT INTO employee(first_name, last_name, role_id) VALUES("Tom", "Cruise", "5");
INSERT INTO employee(first_name, last_name, role_id) VALUES("Tim", "Cook", "2");

