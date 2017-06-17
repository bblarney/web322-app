var fs= require('fs');

var message = "";
var employees = [];
var departments = [];
var empCount = 0;

module.exports.setMessage = (msg) => {
    return new Promise((resolve,reject)=>{
        message = msg;
        resolve();
    });
   
};

module.exports.getMessage = () => {
    return new Promise((resolve,reject)=>{
        if(message.length > 0){
            resolve(message)
        }else{
            reject("Oh No!");
        }
    });
}

module.exports.initialize = () => {
    var error;
    return new Promise((resolve, reject) => {
        fs.readFile('./data/employees.json', (err,data)=>{
            if (err) {
                reject(err);
            }
            employees = JSON.parse(data);
            empCount = employees.length;
            fs.readFile('./data/departments.json', (err,data)=>{
                if (err) reject(err);
                departments = JSON.parse(data);
            });
        });
        resolve();
    });
}

module.exports.getAllEmployees = () => {
    return new Promise((resolve, reject) => {
        if (employees.length == 0){
            reject("no results returned");
        }
        else{
            resolve(employees);
        }
    });
}

module.exports.getEmployeesByStatus = (status) => {
    return new Promise((resolve, reject) => {
        var tempEmployees = [];
        var count = 0;
        for (var i=0; i<employees.length; i++){
            if (employees[i].status == status){
                tempEmployees[count] = employees[i];
                count++;
            }
        }

        if (tempEmployees.length == 0){
            reject("no results returned");
        }
        else{
            resolve(tempEmployees);
        }
    });
}

module.exports.getEmployeesByDepartment = (department) => {
    return new Promise((resolve, reject) => {
        var tempEmployees = [];
        var count = 0;
        for (var i=0; i<employees.length; i++){
            if (employees[i].department == department){
                tempEmployees[count] = employees[i];
                count++;
            }
        }

        if (tempEmployees.length == 0){
            reject("no results returned");
        }
        else{
            resolve(tempEmployees);
        }
    });
}

module.exports.getEmployeesByManager = (manager) => {
    return new Promise((resolve, reject) => {
        var tempEmployees = [];
        var count = 0;
        for (var i=0; i<employees.length; i++){
            if (employees[i].manager == manager){
                tempEmployees[count] = employees[i];
                count++;
            }
        }

        if (tempEmployees.length == 0){
            reject("no results returned");
        }
        else{
            resolve(tempEmployees);
        }
    });
}

module.exports.getEmployeesByNum = (num) => {
    return new Promise((resolve, reject) => {
        for (var i=0; i<employees.length; i++){
            if (employees[i].employeeNum == num){
                resolve(employees[i]);
            }
        }
        reject("no results returned");
    });
}

module.exports.getManagers = () => {
    return new Promise((resolve, reject) => {
        var tempEmployees = [];
        var count = 0;
        for (var i=0; i<employees.length; i++){
            if (employees[i].isManager == true){
                tempEmployees[count] = employees[i];
                count++;
            }
        }

        if (tempEmployees.length == 0){
            reject("no results returned");
        }
        else{
            resolve(tempEmployees);
        }
    });
}

module.exports.getDepartments = () => {
    return new Promise((resolve, reject) => {
        if (departments.length != 0){
            resolve(departments);
        }
        else{
            reject("no results returned");
        }
    });
}

module.exports.addEmployee = (employeeData) => {
    return new Promise((resolve, reject) => {
        empCount++;
        employeeData.employeeNum = empCount;
        employees.push(employeeData);
        resolve();
    });
}

module.exports.updateEmployee = (employeeData) => {
    return new Promise((resolve, reject) => {
        for(var i=0; i<employees.length; i++){
            if (employeeData.employeeNum == employees[i].employeeNum){
                employees[i] = employeeData;
                resolve();
            }
        }
    });
}