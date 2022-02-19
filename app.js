// require the express module
const express = require("express");

// Create an express application.
const app = express();

// require mongoose module to connect to the mongodb
const mongoose = require("mongoose");

// require the routes module
const routes = require("./routes");

// require the cookie-parser module
const cookieParser = require("cookie-parser");

// require authenticate middleware
const { requireAuth, getUserInfo } = require("./middleware/authenticate");

/*******************************
 * MIDDLEWARE
 *******************************/

// configuring static files for the application
app.use(express.static("public"));

// configuring the view-engine for the application
app.set("view engine", "ejs");

// express json parser middleware
app.use(express.json());

// require the cookie parser
app.use(cookieParser());

// database connection
const uri = "mongodb://localhost/node-auth";
mongoose
    .connect(uri)
    .then((result) => {
        // run the application on port 8000
        app.listen(8000);
    })
    .catch((err) => console.log(err));

/*******************************
 * APPLICATION ROUTES
 *******************************/
// Apply the getUserInfo middleware to every single get request
app.get("*", getUserInfo);
app.get("/", function (req, res) {
    res.render("home");
});

// User must be logged in to access this route
app.get("/smoothies", requireAuth, function (req, res) {
    res.render("smoothies");
});
app.use(routes);
