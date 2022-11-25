const { response } = require('express');
const Sequelize = require('sequelize')

const connection = new Sequelize('gstqqjhs', 'gstqqjhs', '3qHkuR1Sn9EMIfeVWwkccRoX6lRbuHl-', {
    host: 'peanut.db.elephantsql.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: true
    },
    query: {raw: true} 
})

connection.authenticate()
.then(() => {
    console.log('connection success');
})
.catch(() => {
    console.log('failed to connect');
})

const Employee = connection.define('Employee', {
    employeeNum: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    SSN: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressState: Sequelize.STRING,
    addressPostal: Sequelize.STRING,
    isManager: Sequelize.BOOLEAN,
    employeeManagerNum: Sequelize.INTEGER,
    status: Sequelize.STRING,
    department: Sequelize.INTEGER,
    hireDate: Sequelize.STRING,
    maritalStatus: Sequelize.STRING
});

const Department = connection.define('Department', {
    departmentId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    departmentName: Sequelize.STRING
})

function getEmployeesByField(field, value) {
    return new Promise((resolve, reject) => {
        Employee.findAll()
        .then((data) => {
            resolve(data.filter(elem => elem[field] == value))
        })
        .catch(() => reject('no results'))
    })
}

function deleteEmployeeByNum(empNum) {
    return new Promise((resolve, reject) => {
        Employee.destroy(
            {
                where: {
                    employeeNum: empNum
                }
            })
        .then(() => {
            resolve()
        })
        .catch((err) => {
            reject(err)
        })
    });
}

function makeEmptyStringsNull(obj) {
    for (const key in obj) {
        if (Object.hasOwnProperty.call(obj, key)) {
            if(obj[key] == "")
                obj[key] = null;
    }
}
}

function normalizeEmployee(employeeData) {
    employeeData.isManager = employeeData.isManager ? true : false;
    makeEmptyStringsNull()
}

function normalizeDepartment(departmentData) {
    makeEmptyStringsNull(departmentData);
}


function Initialize() {
    return new Promise(function(resolve, reject) {
        connection.sync()
        .then(() => resolve())
        .catch(() => reject('unable to sync the database'))
    })
}

function getEmployeesByStatus(status) {
    return getEmployeesByField('status', status);
}

function getEmployeesByDepartment(dep) {
    return getEmployeesByField('department', dep);
}

function getEmployeeByNum(id) {
    return new Promise((resolve, reject) => {
        getEmployeesByField('employeeNum', id)
        .then(data => resolve(data[0]))
        .catch(err => reject(err))
    });
}

function getEmployeesByManager(managerID) {
    return getEmployeesByField('employeeManagerNum', managerID);
}

function addEmployee(employeeData) {
    return new Promise((resolve, reject) => {
            normalizeEmployee(employeeData)
            Employee.create(employeeData)
            .then(() => resolve())
            .catch((err) => reject(err))
    }) 
}

function getAllEmployees() {
    return new Promise((resolve, reject) => {
        Employee.findAll()
        .then(data => { 
            resolve(data);
        })
        .catch(() => {
            reject('no results');
        })
    })
}

function updateEmployee(employeeData) {
    return new Promise((resolve, reject) => {
        normalizeEmployee(employeeData);
        console.log(employeeData);
        Employee.update(employeeData, {where: {employeeNum: employeeData.employeeNum}})
        .success(() => {
            resolve()
        })
        .error(() => reject('could not update an employee'))
    });
}

function getDepartments() {
    return new Promise((resolve, reject) => {
        Department.findAll()
        .then(data => resolve(data))
        .catch(() => reject('no results'))
    })
}

function addDepartment(departmentData) {
    return new Promise((resolve, reject) => {
        normalizeDepartment(departmentData);
        Department.create(departmentData)
        .then(() => resolve())
        .catch(err => reject('unable to insert new department'))
    });
}

function updateDepartment(departmentData) {
    return new Promise((resolve, reject) => {
        normalizeDepartment(departmentData);
        Department.update(departmentData, {where: {departmentId: departmentData.departmentId}})
        .then(() => {
            resolve()
        })
        .catch(() => reject('could not update a department'))
    });
}

function getDepartmentById(id) {
    return new Promise((resolve, reject) => {
        Department.findAll()
        .then(data => resolve(data[0]))
        .catch((err) => reject('was unable to find department with id ' + id))
    });
}

function getManagers() {
    return new Promise((resolve, reject) => {
        reject();
    })
}

module.exports = {
    Initialize,
    getAllEmployees,
    getDepartments,
    getManagers,
    addEmployee,
    getEmployeesByStatus,
    getEmployeesByDepartment,
    getEmployeesByManager,
    getEmployeeByNum,
    updateEmployee,
    addDepartment,
    updateDepartment,
    getDepartmentById,
    deleteEmployeeByNum
}