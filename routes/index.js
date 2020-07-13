const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");

const db_access = require("../db/db_access");
const { requireAuth, setAuthToken, unsetAuthToken } = require("./auth");
const signup_validation = require("./validation");

router.use(bodyParser.urlencoded({ extended: false }));

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  db_access.User.validLogin(email, password)
    .then((auth_token) => {
      console.log("login successful");
      if (auth_token) {
        res.cookie("AuthToken", auth_token);
        res.redirect("/");
      }
    })
    .catch((msg) => {
      res.render("login", {
        messageClass: "alert-danger",
        message: "Please Enter valid details..",
      });
    });
});

router.get("/logout", (req, res) => {
  unsetAuthToken(req.cookies["AuthToken"]);
  res.redirect("/login");
});

router.get("/", requireAuth, (req, res) => {
  if (req.user) {
    db_access.Schedule.all_schedules()
      .then(function (schedule_details) {
        res.render("home", {
          result: schedule_details,
          user: req.user,
        });
      })
      .catch((msg) => {
        res.redirect("/login");
      });
  } else {
    res.redirect("/login");
  }
});

router.get("/user/:id", requireAuth, (req, res) => {
  const { id } = req.params;
  db_access.User.user_info(id).then(function (user_details) {
    db_access.Schedule.schedule_info(id)
      .then(function (schedule_details) {
        res.render("user", {
          userData: user_details[0],
          scheduleData: schedule_details,
          user: req.user,
        });
      })
      .catch((msg) => {
        res.redirect("/");
      });
  });
});

router.get("/schedule", requireAuth, (req, res) => {
  db_access.Schedule.schedule_info(req.user)
    .then(function (schedule_details) {
      res.render("schedule", {
        schedule_details,
        user: req.user,
      });
    })
    .catch((msg) => {
      console.log("error found", msg);
      res.render("schedule", {
        messageClass: "alert-danger",
        message: "No existing schedules. Please create new.",
      });
    });
});

router.post("/schedule", requireAuth, (req, res) => {
  const { day, startTime, endTime } = req.body;
  db_access.Schedule.enter_schedule(day, startTime, endTime, req.user)
    .then(function (result) {
      res.redirect("/schedule");
    })
    .catch((msg) => {
      res.redirect("/schedule");
    });
});

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.post("/signup", (req, res) => {
  const { fname, lname, email, password, c_password } = req.body;
  if (
    signup_validation.valid_signup.signup_info(
      fname,
      lname,
      email,
      password,
      c_password
    )
  ) {
    db_access.User.new_user(fname, lname, email, password)
      .then(function (result) {
        res.render("login", {
          messageClass: "alert-success",
          message: "Registration Successful. Please login.",
        });
      })
      .catch((msg) => {
        res.render("login", {
          messageClass: "alert-danger",
          message: "User already exists. Please login instead.",
        });
      });
  } else {
    res.render("signup", {
      messageClass: "alert-danger",
      message: "Please Enter valid details..",
    });
  }
});

module.exports = router;
