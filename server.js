/*********************************************************************************
* WEB322 – Assignment 04
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: ___Brett Larney___ Student ID: _129308169_ Date: __June 17 2017__
*
* Online (Heroku) Link: ______https://afternoon-taiga-14912.herokuapp.com/______
*
********************************************************************************/

var data_service = require("./data-service");
var express = require("express");
var path = require("path");
var app = express();
var fs = require("fs");
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));
app.engine(".hbs", exphbs({
  extname: ".hbs",
  defaultLayout: 'layout',
  helpers: {
    equal: function (lvalue, rvalue, options) {
      if (arguments.length < 3)
        throw new Error("Handlebars Helper equal needs 2 parameters");
      if (lvalue != rvalue) {
        return options.inverse(this);
      } else {
        return options.fn(this);
      }
    }
  }
}));
app.set("view engine", ".hbs");

var HTTP_PORT = process.env.PORT || 8080;

// call this function after the http server starts listening for requests
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

// setup a 'route' to listen on the default url path (http://localhost)
app.get("/", (req,res) => {
   res.render("home");
});

// setup another route to listen on /about
app.get("/about", (req,res) =>{
   res.render("about");
});

//route for updating employees
app.post("/employee/update", (req, res) => {
 data_service.updateEmployee(req.body).then(() =>{
  res.redirect("/employees");
 }).catch((err) => {
   console.log(err);
 });
});

//route for adding employees
app.get("/employees/add", (req,res) => {
  res.render("addEmployee");
});

app.post("/employees/add", (req, res) => {
  data_service.addEmployee(req.body).then(() =>{
    res.redirect("/employees");
  }).catch((err) => {
    console.log(err);
  });
});

// setup another route to listen on /employees
app.get("/employee/:empNum", (req,res) => {
   data_service.getEmployeesByNum(req.params.empNum).then((data) => {
     res.render("employee", { data: data });
  }).catch((err) => {
    res.status(404).send("Employee Not Found");
  });
});

// setup another route to listen on /employees
app.get("/employees", (req, res) => {

    if(req.query.status){

      data_service.getEmployeesByStatus(req.query.status).then((data) => {
        res.render("employeeList", { data: data, title: "Employees" });
        }).catch((err) => {
          res.render("employeeList", { data: {}, title: "Employees" });
        });
    }
    else if(req.query.manager){
        data_service.getEmployeesByManager(req.query.manager).then((data) => {
        res.render("employeeList", { data: data, title: "Employees" });
        }).catch((err) => {
          res.render("employeeList", { data: {}, title: "Employees" });
        });
    }
    else if(req.query.department){
        data_service.getEmployeesByDepartment(req.query.department).then((data) => {
        res.render("employeeList", { data: data, title: "Employees" });
        }).catch((err) => {
          res.render("employeeList", { data: {}, title: "Employees" });
        });
    }
    else{
        data_service.getAllEmployees().then((data)=>{
        res.render("employeeList", { data: data, title: "Employees" });
        }).catch((err)=>{
            res.render("employeeList", { data: {}, title: "Employees" });
        });    
    }
});

// setup another route to listen on /employees
app.get("/managers", (req,res) => {
   data_service.getManagers().then((data) => {
     res.render("employeeList", { data: data, title: "Employees(Managers)" });
  }).catch((err) => {
    res.render("employeeList", { data: {}, title:"Employees (Managers)" });
  });
});

// setup another route to listen on /employees
app.get("/departments", (req,res) => {
  data_service.getDepartments().then((data) => {
     res.render("departmentList", { data: data, title:"Departments" });
  }).catch((err) => {
     res.render("departmentList", { data: {}, title:"Departments" });
  });
});

//page not found
app.use((req, res) => {
  res.status(404).send("Page Not Found");
});

// setup http server to listen on HTTP_PORT
data_service.initialize().then(() => {
  app.listen(HTTP_PORT, onHttpStart);
}).catch((err) => {
  console.log(err);
});
