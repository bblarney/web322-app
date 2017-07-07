const Sequelize = require('sequelize');

var sequelize = new Sequelize('dbu618hhi0mkcs', 'xjerudpbtgrbug', 'd5dda98f0e83e7b9d00eef5233c18d7ac6ac1eb4c2a495e8050b81b50aca485e', {
    host: 'ec2-107-21-113-16.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: true
    },
    omitNull:true
},{
    createdAt: false, // disable createdAt
    updatedAt: false // disable updatedAt
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
},{
    createdAt: false, // disable createdAt
    updatedAt: false // disable updatedAt
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
        message = msg;
        resolve();
    });
   
};

module.exports.getMessage = () => {
    return new Promise(function (resolve, reject) {
        if(message.length > 0){
            resolve(message)
        }else{
            reject("Oh No!");
        }
    });
}

module.exports.initialize = () => {
    return new Promise(function (resolve, reject) {
        sequelize.sync().then(function() {
            /*Employee.create({
                title: 'Employee1',
                description: 'First Employee Table'
            }).catch(function (error){
                reject("unable to sync the database");
            });

            Department.create({
                title: 'Department1',
                description: 'First Department Table'
                }).then(function (Department){
                    resolve();
                }).catch(function (error){
                    reject("unable to sync the database");
            });*/
            resolve();
        }).catch((err) =>{
            reject("unable to sync the database");
        });
    });
}

module.exports.getAllEmployees = () => {
    return new Promise(function (resolve, reject) {
        Employee.findAll({
            order: [['employeeNum','ASC']]
        }).then(function(data){
            resolve(data);
        }).catch(() =>{
                reject("no results returned");
        });
    });
}

module.exports.getEmployeesByStatus = (status) => {
    return new Promise(function (resolve, reject) {
        Employee.findAll({
            where: {status: status},
            order: [['employeeNum','ASC']]
        }).then(function(data){
            resolve(data);
        }).catch(() =>{
            reject("no results returned");
        });
    });
}

module.exports.getEmployeesByDepartment = (department) => {
    return new Promise(function (resolve, reject) {
        Employee.findAll({
            where: {department: department},
            order: [['employeeNum','ASC']]
        }).then(function(data){
            resolve(data);
        }).catch(() =>{
            reject("no results returned");
        });
    });
}

module.exports.getEmployeesByManager = (manager) => {
    return new Promise(function (resolve, reject) {
        Employee.findAll({
            where: {employeeManagerNum: manager},
            order: [['employeeNum','ASC']]
        }).then(function(data){
            resolve(data);
        }).catch(() =>{
            reject("no results returned");
        });
    });
}

module.exports.getEmployeeByNum = (num) => {
    return new Promise(function (resolve, reject) {
        Employee.findAll({
            where: {employeeNum: num}
        }).then(function(data){
            resolve(data[0]);
        }).catch(() =>{
            reject("no results returned");
        });
    });
}

module.exports.getManagers = () => {
    return new Promise(function (resolve, reject) {
        Employee.findAll({
            where: {isManager: true},
            order: [['employeeNum','ASC']]
        }).then(function(data){
            resolve(data);
        }).catch(() =>{
            reject("no results returned");
        });
    });
}

module.exports.getDepartments = () => {
    return new Promise(function (resolve, reject) {
        Department.findAll({order: [['departmentId','ASC']]}).then(function(data){
            resolve(data);
        }).catch(() =>{
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

        try{
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
            });
        }
        catch(err){
            reject("unable to update employee");
        }
        finally{
            resolve();
        }
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
        
        Department.update({
             departmentName: departmentData.departmentName},
             {where: {departmentId : departmentData.departmentId}
        }).then(()=> {
              resolve();
        }).catch((err) => {
              reject(err);
        });
    });
}

module.exports.getDepartmentById = (id) => {
    return new Promise(function (resolve, reject) {
        Department.findAll({
            where: {departmentId: id}
        }).then(function(data){
            if (data)
                resolve(data[0]);
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