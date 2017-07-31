/*********************************************************************************
* WEB322 – Assignment 06
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: ___Brett Larney___ Student ID: _129308169_ Date: __July 16 2017__
*
* Online (Heroku) Link: ______https://afternoon-taiga-14912.herokuapp.com/______
*
********************************************************************************/

var data_service = require("./data-service");
var express = require("express");
var path = require("path");
var app = express();
var fs = require("fs");
var clientSessions = require("client-sessions");
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const dataServiceComments = require("./data-service-comments.js");
const dataServiceAuth = require("./data-service-auth.js")
 

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

app.use(clientSessions({
  cookieName: "session", // this is the object name that will be added to 'req'
  secret: "assignment7blarney_web322", // this should be a long un-guessable string.
  duration: 2 * 60 * 1000, // duration of the session in milliseconds (2 minutes)
  activeDuration: 1000 * 60 // the session will be extended by this many ms each request (1 minute)
}));

app.use(function(req, res, next) {
 res.locals.session = req.session;
 next();
});

app.set("view engine", ".hbs");

var HTTP_PORT = process.env.PORT || 8080;

// call this function after the http server starts listening for requests
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

function ensureLogin(req, res, next) {
  if (!req.session.user) {
    res.redirect("/login");
  } else {
    next();
  }
}

// setup a 'route' to listen on the default url path (http://localhost)
app.get("/", (req,res) => {
   res.render("home");
});

// setup another route to listen on /about
app.get("/about", (req,res) =>{
  dataServiceComments.getAllComments().then((dataFromPromise)=>{
    res.render("about",{data:dataFromPromise});
  }).catch((err)=>{
    res.render("about");
  });
   
});

//route for updating employees
app.post("/employee/update", ensureLogin, (req, res) => {
    data_service.updateEmployee(req.body).then(() =>{
     res.redirect("/employees");
    }).catch((err) => {
      console.log(err);
    });
});

app.post("/departments/update", ensureLogin, (req, res) => {
    data_service.updateDepartment(req.body).then(() =>{
      res.redirect("/departments");
    }).catch((err) => {
      console.log(err);
    });
});

//route for adding employees
app.get("/employees/add", ensureLogin, (req,res) => {
    data_service.getDepartments().then((data)=>{
     res.render("addEmployee", {departments:data});
    }).catch((err) =>{
      res.render("addEmployee", {departments: []});
    });
});

app.post("/employees/add", ensureLogin, (req, res) => {
    data_service.addEmployee(req.body).then(() =>{
      res.redirect("/employees");
    }).catch((err) => {
     console.log(err);
    });
});

app.get("/departments/add", ensureLogin, (req,res) => {
    res.render("addDepartment");
});

app.post("/departments/add", ensureLogin, (req, res) => {
    data_service.addDepartment(req.body).then(() =>{
     res.redirect("/departments");
   }).catch((err) => {
     console.log(err);
   });
});

// setup another route to listen on /employees
app.get("/employee/:empNum", ensureLogin, (req, res) => {
 // initialize an empty object to store the values
 let viewData = {};
 data_service.getEmployeeByNum(req.params.empNum)
 .then((data) => {
 viewData.data = data; //store employee data in the "viewData" object as "data"
 }).catch(()=>{
 viewData.data = null; // set employee to null if there was an error
 }).then(data_service.getDepartments())
 .then((data) => {
 viewData.departments = data; // store department data in the "viewData" object as "departments"

 // loop through viewData.departments and once we have found the departmentId that matches
 // the employee's "department" value, add a "selected" property to the matching
 // viewData.departments object
 for (let i = 0; i < viewData.departments.length; i++) {
 if (viewData.departments[i].departmentId == viewData.data.department) {
 viewData.departments[i].selected = true;
 }
 }
 }).catch(()=>{
 viewData.departments=[]; // set departments to empty if there was an error
 }).then(()=>{
 if(viewData.data == null){ // if no employee - return an error
 res.status(404).send("Employee Not Found");
 }else{
 res.render("employee", { viewData: viewData }); // render the "employee" view
 }
});
});


app.get("/employee/delete/:empNum", ensureLogin, (req,res) => {
   data_service.deleteEmployeeByNum(req.params.empNum).then(()=>{
      res.redirect("/employees");
   }).catch(()=>{
      res.status(500).send("Unable to remove employee");
   });
});

app.get("/department/:departmentId", ensureLogin, (req,res) => {
   data_service.getDepartmentById(req.params.departmentId).then((data) => {
     res.render("department", { data: data });
  }).catch((err) => {
    res.status(404).send("Department Not Found");
  });
});

// setup another route to listen on /employees
app.get("/employees", ensureLogin, (req, res) => {
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
app.get("/managers", ensureLogin, (req,res) => {
   data_service.getManagers().then((data) => {
     res.render("employeeList", { data: data, title: "Employees(Managers)" });
  }).catch((err) => {
    res.render("employeeList", { data: {}, title:"Employees (Managers)" });
  });
});

// setup another route to listen on /employees
app.get("/departments", ensureLogin, (req,res) => {
  data_service.getDepartments().then((data) => {
     res.render("departmentList", { data: data, title:"Departments" });
  }).catch((err) => {
     res.render("departmentList", { data: {}, title:"Departments" });
  });
});

//addcomment post route
app.post("/about/addComment", (req,res) => {
  dataServiceComments.addComment(req.body).then(()=>{
    res.redirect("/about");
  }).catch((err)=>{
    console.log(err);
    res.redirect("/about");
  });
});

//addreply post route
app.post("/about/addReply", (req,res) => {
  dataServiceComments.addReply(req.body).then(()=>{
    res.redirect("/about");
  }).catch((err)=>{
    console.log(err);
    res.redirect("/about");
  });
});

app.get("/login", (req,res) => {
  res.render("login");
});

app.get("/register", (req,res) => {
    res.render("register");
});

app.post("/register", (req,res) => {
  dataServiceAuth.registerUser(req.body).then(()=>{
    res.render("register", {successMessage: "User created"});
  }).catch((err)=>{
    res.render("register", {errorMessage: err, user: req.body.user});
  });
});

app.post("/login", (req,res) => {
  dataServiceAuth.checkUser(req.body).then(()=>{
    req.session.user ={
      username: req.body.user
    };
    res.redirect("/employees");
  }).catch((err)=>{
    res.render("login", {errorMessage: err, user: req.body.user});
  });
});

app.get("/logout", (req,res) => {
  req.session.reset();
  res.redirect("/");
});

//page not found
app.use((req, res) => {
  res.status(404).send("Page Not Found");
});

// setup http server to listen on HTTP_PORT
data_service.initialize()
.then(dataServiceComments.initialize)
.then(dataServiceAuth.initialize)
.then(() => {
  app.listen(HTTP_PORT, onHttpStart);
}).catch((err) => {
  console.log(err);
});
