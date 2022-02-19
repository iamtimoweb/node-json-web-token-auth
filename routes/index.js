// require Router from the express module
const { Router } = require("express");

// creating a router instance
const router = Router();

// require the AuthController
//const auth = require("../controllers/AuthController");
const {
    showRegistrationForm,
    postRegistrationForm,
    showLoginForm,
    postLoginForm,
    logout,
} = require("../controllers/AuthController");

/*******************************
 * AUTHENTICATION ROUTES
 *******************************/
router.get("/signup", showRegistrationForm);
router.post("/signup", postRegistrationForm);
router.get("/login", showLoginForm);
router.post("/login", postLoginForm);
router.get("/logout", logout);

module.exports = router;
