const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
let Schema = mongoose.Schema;

var userSchema = new Schema({
    "user":{type:String, unique:true},
    "password":String
});

let User; // to be defined on new connection (see initialize)

module.exports.initialize = function () {
    return new Promise(function (resolve, reject) {
        let db2 = mongoose.createConnection(""); //INSERT CONNECTION STRING HERE
        db2.on('error', (err)=>{
            reject(err); // reject the promise with the provided error
        });
        db2.once('open', ()=>{
            User = db2.model("users", userSchema);
            resolve();
        });
    });
};

module.exports.registerUser = function (userData) {
    return new Promise(function (resolve, reject) {

        if (userData.password != userData.password2){
            reject("Passwords do not match");
        }
        else{
            let newUser = new User(userData);

            bcrypt.genSalt(10, function(err, salt) { // Generate a "salt" using 10 rounds
                bcrypt.hash(userData.password, salt, function(err, hash) { // encrypt the password: "myPassword123"
                    // TODO: Store the resulting "hash" value in the DB
                    if (err){
                        reject("There was an error encrypting the password");
                    }else{
                        newUser.password = hash;
                        newUser.save((err) => {
                            if(err == 11000) {
                                reject("Username already taken");
                            } else if (err && err != 11000) {
                                reject("There was an error creating the user: " + err);
                            }
                            else{
                                resolve();
                            }
                        });
                    }
                });
            });  
        }
    });
};

module.exports.checkUser = function (userData) {
    return new Promise(function (resolve, reject) {
        User.find({user: userData.user})
        .exec()
        .then((data) => {
            if (data.user == ""){
                reject("unable to find user: " + userData.user);
            }
            console.log(userData.password);

            bcrypt.compare(userData.password, data[0].password).then((res) => {
                if (res === true){
                     resolve();
                }else{
                    reject("Incorrect password");
                }
            });
        }).catch((err) => {
            reject("unable to find user: " + userData.user + err);
        });
    });
};

module.exports.updatePassword = function (userData) {
    return new Promise(function (resolve, reject) {

        if (userData.password != userData.password2){
            reject("Passwords do not match");
        }
        else{
            bcrypt.genSalt(10, function(err, salt) { // Generate a "salt" using 10 rounds
                bcrypt.hash(userData.password, salt, function(err, hash) { // encrypt the password: "myPassword123"
                    // TODO: Store the resulting "hash" value in the DB
                    if (err){
                        reject("There was an error encrypting the password");
                    }else{
                        User.find({user: userData.user})
                        .exec()
                        .then((data) => {
                            User.update({ user: userData.user },
                            { $set: { password: hash } },
                            { multi: false })
                            .exec()
                            .then(resolve())
                            .catch(reject("There was an error updating the password for" + userDatas.user));
                        });
                    }
                });
            });  
        }
    });
};
