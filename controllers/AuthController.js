// require the User model
const User = require("../models/User");
// require the jwb
const jwt = require("jsonwebtoken");
const maxAge = 3 * 24 * 60 * 60;
// handler validation errors
function handleErrors(err) {
    console.log(err.message, err.code);

    let errors = { email: "", password: "" };

    if (err.message === "Incorrect Email Address") {
        errors.email = "Email address doesn't exist in the database";
    }

    if (err.message === "Incorrect Password") {
        errors.password = "please enter a correct password to login";
    }

    // checking for the uniqueness of the email or duplicate error codes
    if (err.code === 11000) {
        errors.email = "email address has already been taken";
        return errors;
    }

    // user validation errors
    if (err.message.includes("User validation failed")) {
        //console.log(err);
        // console.log(Object.values(err.errors));
        Object.values(err.errors).forEach((error) => (errors[error.path] = error.message));
    }
    return errors;
}
// function to create a token after user registration
function createToken(id) {
    return jwt.sign({ id }, "the net ninja secret", {
        expiresIn: maxAge,
    });
}
/*
 * show the registration form
 */

function showRegistrationForm(req, res) {
    res.render("signup");
}

/*
 * post the registration form
 */

function postRegistrationForm(req, res) {
    // creating a user after registration
    User.create(req.body)
        .then((result) => {
            const token = createToken(result._id);
            // create cookie to store the token
            res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
            res.status(201).json({ user: result._id });
        })
        .catch((err) => {
            const errors = handleErrors(err);
            res.status(400).json({ errors });
        });
}

/*
 * show the login form
 */

function showLoginForm(req, res) {
    res.render("login");
}

/*
 * post the login form
 */

function postLoginForm(req, res) {
    const { email, password } = req.body;
    // res.send(req.body);
    User.login(email, password)
        .then((user) => {
            // create token for the user
            const token = createToken(user._id);
            // store the token inside the cookie
            res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
            res.status(200).json({ user: user._id });
        })
        .catch((err) => {
            const errors = handleErrors(err);
            res.status(400).json({ errors });
        });
}

/*
 * logout of the application
 */
function logout(req, res) {
    // replace the cookie with a blank string and give it expiration time of 1 millisecond
    res.cookie("jwt", "", { maxAge: 1 });
    res.redirect("/");
}

module.exports = {
    showRegistrationForm,
    postRegistrationForm,
    showLoginForm,
    postLoginForm,
    logout,
};
