const Sequelize = require('sequelize');

var sequelize = new Sequelize('dbu618hhi0mkcs', 'xjerudpbtgrbug', 'd5dda98f0e83e7b9d00eef5233c18d7ac6ac1eb4c2a495e8050b81b50aca485e', {
    host: 'ec2-107-21-113-16.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: true
    }
});

var Employee = sequelize.define('Employee', {
    employeeNum: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true},
    firstName: Sequelize.STRING,
    last_name: Sequelize.STRING,
    email: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addresCity: Sequelize.STRING,
    addressState: Sequelize.STRING,
    addressPostal: Sequelize.STRING,
    maritalStatus: Sequelize.STRING,
    isManager: Sequelize.BOOLEAN,
    employeeManagerNum: Sequelize.INTEGER,
    status: Sequelize.STRING,
    department: Sequelize.INTEGER,
    hireDate: Sequelize.STRING,
});

var Department = sequelize.define('Department', {
    departmentId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true},
    departmentName: Sequelize.STRING
});

module.exports.setMessage = (msg) => {
    return new Promise(function (resolve, reject) {
        reject();
    });
   
};

module.exports.getMessage = () => {
    return new Promise(function (resolve, reject) {
        reject();
    });
}

module.exports.initialize = () => {
    return new Promise(function (resolve, reject) {
        sequelize.sync().then(function() {
            Employee.create({
                title: 'Employee1',
                description: 'First Employee Table'
            }).catch(function (error){
                reject("unable to sync the database");
            });

            Department.create({
                title: 'Department1',
                description: 'First DepartmentTable'
                }).then(function (Department){
                    resolve();
                }).catch(function (error){
                    reject("unable to sync the database");
            });
        });
    });
}

module.exports.getAllEmployees = () => {
    return new Promise(function (resolve, reject) {
        Employee.findAll({}).then(function(data){
            if (data)
                resolve(data);
            else if (!data)
                reject("no results returned");
        });
    });
}

module.exports.getEmployeesByStatus = (status) => {
    return new Promise(function (resolve, reject) {
        Employee.findAll({
            where: {status: status}
        }).then(function(data){
            if (data)
                resolve(data);
            else if (!data)
                reject("no results returned");
        });
    });
}

module.exports.getEmployeesByDepartment = (department) => {
    return new Promise(function (resolve, reject) {
        Employee.findAll({
            where: {department: department}
        }).then(function(data){
            if (data)
                resolve(data);
            else if (!data)
                reject("no results returned");
        });
    });
}

module.exports.getEmployeesByManager = (manager) => {
    return new Promise(function (resolve, reject) {
        Employee.findAll({
            where: {employeeManagerNum: manager}
        }).then(function(data){
            if (data)
                resolve(data);
            else if (!data)
                reject("no results returned");
        });
    });
}

module.exports.getEmployeeByNum = (num) => {
    return new Promise(function (resolve, reject) {
        Employee.findAll({
            where: {employeeNum: num}
        }).then(function(data){
            if (data)
                resolve(data);
            else if (!data)
                reject("no results returned");
        });
    });
}

module.exports.getManagers = () => {
    return new Promise(function (resolve, reject) {
        Employee.findAll({
            where: {isManager: true}
        }).then(function(data){
            if (data)
                resolve(data);
            else if (!data)
                reject("no results returned");
        });
    });
}

module.exports.getDepartments = () => {
    return new Promise(function (resolve, reject) {
        Department.findAll({}).then(function(data){
            if (data)
                resolve(data);
            else if (!data)
                reject("no results returned");
        });
    });
}

module.exports.addEmployee = (employeeData) => {
    return new Promise(function (resolve, reject) {

        employeeData.isManager = (employeeData.isManager) ? true : false;

        for (var prop in employeeData) {
            if (employeeData[prop] == ""){
                employeeData[prop] = null;
            }
        }

        try{
            Employee.create({
                employeeNum: employeeData.employeeNum,
                firstName: employeeData.firstName,
                last_name: employeeData.last_name,
                email: employeeData.email,
                addressStreet: employeeData.addressStreet,
                addresCity: employeeData.addresCity,
                addressState: employeeData.addressState,
                addressPostal: employeeData.addressPostal,
                maritalStatus: employeeData.maritalStatus,
                isManager: employeeData.isManager,
                employeeManagerNum: employeeData.employeeManagerNum,
                status: employeeData.status,
                department: employeeData.department,
                hireDate: employeeData.hireDate,
            });
        }
        catch(err){
            reject("unable to create employee");
        }
        finally{
            resolve();
        }
    });
}

module.exports.updateEmployee = (employeeData) => {
    return new Promise(function (resolve, reject) {

        employeeData.isManager = (employeeData.isManager) ? true : false;

        for (var prop in employeeData) {
            if (employeeData[prop] == ""){
                employeeData[prop] = null;
            }
        }

        sequelize.sync().then(function(){
            Employee.update({
                firstName: employeeData.firstName,
                last_name: employeeData.last_name,
                email: employeeData.email,
                addressStreet: employeeData.addressStreet,
                addresCity: employeeData.addresCity,
                addressState: employeeData.addressState,
                addressPostal: employeeData.addressPostal,
                maritalStatus: employeeData.maritalStatus,
                isManager: employeeData.isManager,
                employeeManagerNum: employeeData.employeeManagerNum,
                status: employeeData.status,
                department: employeeData.department,
                hireDate: employeeData.hireDate},
              {where: {employeeNum : employeeData.employeeNum}
            }).then(()=> {
                resolve();
            }).catch((err) => {
                reject(err);
            });
        });
    });
}

module.exports.addDepartment = (departmentData) => {
    return new Promise(function (resolve, reject) {

        for (var prop in departmentData) {
            if (departmentData[prop] == ""){
                departmentData[prop] = null;
            }
        }

        try{
            Department.create({
                departmentId: departmentData.departmentId,
                departmentName: departmentData.departmentName
            });
        }
        catch(err){
            reject("unable to create department");
        }
        finally{
            resolve();
        }
    });
}

module.exports.updateDepartment = (departmentData) => {
    return new Promise(function (resolve, reject) {
        for (var prop in departmentData) {
            if (departmentData[prop] == ""){
                departmentData[prop] = null;
            }
        }
        
        sequelize.sync().then(function(){
            Department.update({
                departmentName: departmentData.departmentName},
                {where: {departmentId : departmentData.departmentId}
            }).then(()=> {
                resolve();
            }).catch((err) => {
                reject(err);
            });
        });
    });
}

module.exports.getDepartmentById = (id) => {
    return new Promise(function (resolve, reject) {
        Department.findAll({
            where: {departmentId: id}
        }).then(function(data){
            if (data)
                resolve(data);
            else if (!data)
                reject("no results returned");
        });
    });
}

module.exports.deleteEmployeeByNum = (empNum) => {
    return new Promise(function (resolve, reject) {
        Employee.destroy({
            where: {employeeNum : empNum}
        }).then(function(){
            resolve();
        }).catch((err)=>{
            reject(err);
        });
    });
}