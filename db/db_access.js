const mysql = require("mysql");
var Promise = require('promise');
const dbconfig = require("./config.js"); 
const auth = require("../routes/auth.js");
const con = mysql.createConnection(dbconfig);


module.exports.User =  {

    // Validate login details and redirect to home page
    validLogin (email, password) {
        const hashedPassword = auth.getHashedPassword(password);
        let sql = `SELECT password, user_id FROM users WHERE emailid = '` +email+ `'`;
        return new Promise(function(resolve, reject) {
            con.query(sql, function(err, result) {
                if(result.length > 0) {
                    if (hashedPassword == result[0].password) {
                        const auth_token = auth.setAuthToken(result[0].user_id)
                        resolve(auth_token);
                     } else { 
                        reject();
                        return;
                    }
                } else {
                    console.log("user not found")
                    reject();
                }  
            });
        });
    },
    
    // Adding new user to the user table with hashed password.
    new_user (fname, surname, email, password)  {
        const hashedPassword = auth.getHashedPassword(password);
        let sql = `SELECT * FROM users where emailid = '` +email+ `'`;
        return new Promise(function(resolve, reject){
            con.query(sql, (err, result) => {
                if (err) throw err;
                if(result.length == 0){
                    let post = {surname: surname, name: fname, emailid: email, password: hashedPassword};
                    let sql1 = 'INSERT INTO users SET ? ';
                    con.query(sql1, post, (err, res1) => {
                        if (err) throw err;
                        resolve();
                    });
                } else {
                    reject();
                }
            });    
        });
    },

    // get user info by passing their id
    user_info (id) {
        //let sql = `SELECT name, surname, emailid, day, start_time, end_time FROM users, schedule where users.user_id = '`+id+`' AND schedule.user_id = '`+id+`'`;
        let sql = `SELECT name, surname, emailid FROM users, schedule where users.user_id = '`+id+`'`;
        return new Promise(function(resolve, reject){
            con.query(sql, (err, result) => {
                if (err) throw err;
                if(result.length > 0){
                    resolve(result);
                }
                else {
                    reject();
                    return;
                }    
            });
        });   
    }

};

module.exports.Schedule = {

    // Get all schedules on home page
    all_schedules() {
        let sql = 'SELECT users.user_id, name, surname, day, start_time, end_time FROM users, schedule WHERE users.user_id = schedule.user_id';
        return new Promise(function(resolve, reject){
            con.query(sql, (err, result) => {
                if (err) throw err;
                if(result.length > 0){
                    resolve(result);
                }
                else {
                    reject();
                    return;
                }    
            });    
        });    
    },

    // Get all schedules for logged in user
    schedule_info (id) {
        let sql = `SELECT day, start_time, end_time FROM schedule WHERE schedule.user_id = '`+id+`'`;
        return new Promise(function(resolve, reject){
            con.query(sql, (err, result) => {
                if (err) throw err;
                if(result.length > 0){
                    resolve(result);
                }
                else {
                    reject();
                    return;
                }    
            });    
        });   
    },

    // Create new schedule entry
    enter_schedule(weekday, startTime, endTime, id){
        let post = {day: weekday, start_time: startTime, end_time: endTime, user_id: id };
        let sql = 'INSERT INTO schedule SET ?';
        return new Promise(function(resolve, reject){
            con.query(sql, post, (err, result) => {
                if (err) throw err;
                if(result.length > 0){
                    resolve(result);
                }
                else {
                    reject();
                    return;
                }    
            });    
        });   
    }

};
    
