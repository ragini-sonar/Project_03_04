const express = require("express");
const exphbs = require("express-handlebars");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const config_db = require("./db/init_db");
const auth = require("./routes/auth");

config_db();

const app = express();

app.use(express.static("public"));

// Set up view engine
const hbs = exphbs.create({
  extname: ".hbs",
  // helpers: hbsHelpers,
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");

app.use(bodyParser.urlencoded({ extended: true })); // parse POST data
app.use(cookieParser());

app.use((req, res, next) => {
  // Get auth token from the cookies
  const authToken = req.cookies["AuthToken"];
  // Inject the user id into req.user
  req.user = auth.getSessionUser(authToken);
  next();
});
//app.use(getSessionUser);

app.use(require("./routes"));

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
