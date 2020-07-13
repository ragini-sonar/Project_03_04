const mysql = require("mysql");
const dbconfig = require("./config.js"); 

const con = mysql.createConnection(dbconfig);

module.exports = function () { 
    // connect to database
    con.connect(function(err){
        if (err) {    
            console.log("Error connecting Data base..." + err);
        } 
        else {
            console.log("Data base connected!");

            let sql = 'CREATE TABLE if not exists users (user_id int AUTO_INCREMENT, surname VARCHAR(255), name VARCHAR(255), emailid VARCHAR(255), password VARCHAR(255), PRIMARY KEY (user_id))';
            con.query(sql, (err, result) => {
                if(err) console.log('Found the error in user table' + err);
            });

            let sql1 = 'CREATE TABLE if not exists schedule(id int AUTO_INCREMENT, user_id int, day VARCHAR(255), start_time TIME, end_time TIME , PRIMARY KEY (id), FOREIGN KEY (user_id) REFERENCES users (user_id))'; 
            con.query(sql1, (err, result) => {
                if(err) console.log("Found error in schedule table" + err);
            });
        }   
    });       
};


