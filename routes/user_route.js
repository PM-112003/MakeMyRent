const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users_controller.js");

// starting routes
{
    router.get("/", (req, res) => {
        res.redirect("/login");  // Redirect to login page
    });    
}
// Signup route
{
    router.get("/signup", userController.renderSignUpForm);
    
    router.post("/signup", wrapAsync(userController.signup));
}

// creating login functionality
{
    router.get("/login", (req, res)=>{
        res.render("users/login.ejs");
    });
    
    
    router.post("/login", saveRedirectUrl, passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
    }), userController.loginForm)
}


// creating logout functionality
{
    router.get("/logout", userController.logout)
}

module.exports = router;