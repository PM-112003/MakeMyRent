const User = require("../models/user");


module.exports.renderSignUpForm = (req, res)=>{
    res.render("users/signup.ejs");
}

module.exports.signup = async (req, res)=>{
        try{
            let {username, email, password} = req.body;
            const newUser = new User({email, username});
            const registeredUser = await User.register(newUser, password);
            // console.log(registeredUser);
            req.login(registeredUser, (err) => {
                if(err){
                    return next(err);
                }
                req.flash("success", "Registration Successful!");
                res.redirect("/listings");
            })

        } catch(e){
            req.flash("error", e.message);
            res.redirect("/signup");
        }
}

module.exports.loginForm = async (req, res) => {
    req.flash("success", "Welcome back to MakeMyRent!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}


module.exports.logout = (req, res, next)=>{
    req.logout((err) => {
        if(err){
            return next(err);
        }

        req.flash("success", "You logged out!");
        res.redirect("/listings");
    })
}

