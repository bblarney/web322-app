/*********************************************************************************
* WEB322 – Assignment 03
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: ___Brett Larney____ Student ID: _129308169_ Date: __June 8 2017__
*
* Online (Heroku) Link: ______https://afternoon-taiga-14912.herokuapp.com/______
*
********************************************************************************/

var data_service = require("./data-service");
var express = require("express");
var path = require("path");
var app = express();
var fs = require("fs");

app.use(express.static('public'));

var HTTP_PORT = process.env.PORT || 8080;

// call this function after the http server starts listening for requests
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

// setup a 'route' to listen on the default url path (http://localhost)
app.get("/", (req,res) => {
   res.sendFile(path.join(__dirname + "/views/home.html"));
});

// setup another route to listen on /about
app.get("/about", (req,res) =>{
   res.sendFile(path.join(__dirname + "/views/about.html"));
});

// setup another route to listen on /employees
app.get("/employees", (req, res) => {

    if(req.query.status){

      data_service.getEmployeesByStatus(req.query.status).then((data) => {
        res.json({data});
        }).catch((err) => {
          res.json({message: err});
        });
    }
    else if(req.query.manager){
        data_service.getEmployeesByManager(req.query.manager).then((data) => {
        res.json({data});
        }).catch((err) => {
          res.json({message: err});
        });
    }
    else if(req.query.department){
        data_service.getEmployeesByDepartment(req.query.department).then((data) => {
        res.json({data});
        }).catch((err) => {
          res.json({message: err});
        });
    }
    else{
        data_service.getAllEmployees().then((data)=>{
            res.json({data});
        }).catch((err)=>{
            res.json({message: err});
        });    
    }
});

// setup another route to listen on /employees
app.get("/employees/:empNum", (req,res) => {
   data_service.getEmployeesByNum(req.params.empNum).then((data) => {
    res.json({data});
  }).catch((err) => {
    res.json({message: err});
  });
});

// setup another route to listen on /employees
app.get("/managers", (req,res) => {
   data_service.getManagers().then((data) => {
    res.json({data});
  }).catch((err) => {
    res.json({message: err});
  });
});

// setup another route to listen on /employees
app.get("/departments", (req,res) => {
  data_service.getDepartments().then((data) => {
    res.json({data});
  }).catch((err) => {
    res.json({message: err});
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
