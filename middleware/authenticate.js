const jwt = require("jsonwebtoken");
const User = require("../models/User");

const requireAuth = function (req, res, next) {
    // get the token stored inside the cookie jwt
    const token = req.cookies.jwt;
    // check whether the json web token exists and is verified
    if (token) {
        // compare the token with the secret used to create the stoken
        jwt.verify(token, "the net ninja secret", function (err, decodedToken) {
            // check if there is an error
            if (err) {
                console.log(err.message);
                res.redirect("/login");
            } else {
                console.log(decodedToken);
                next();
            }
        });
    } else {
        res.redirect("/login");
    }
};

const getUserInfo = function (req, res, next) {
    // get the token stored inside the cookie jwt
    const token = req.cookies.jwt;
    // check whether the json web token exists and is verified
    if (token) {
        // compare the token with the secret used to create the stoken
        jwt.verify(token, "the net ninja secret", async function (err, decodedToken) {
            // check if there is an error
            if (err) {
                console.log(err.message);
                // incase the token is not valid after comparison, create variable that will be accessed inside the templates and set it to null
                res.locals.user = null;
                next();
            } else {
                console.log(decodedToken);
                // incase the token is valid after comparison, create variable that will be accessed inside the templates and give it the id of the user from the decoded token
                let user = await User.findById(decodedToken.id);
                res.locals.user = user;
                next();
            }
        });
    } else {
        res.locals.user = null;
        next();
    }
};

module.exports = { requireAuth, getUserInfo };
