if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}


const express = require("express");
const mongoose = require("mongoose");
const app = express();
const listing = require("../Backend/models/listing.js");
const path = require("path");
const methodOverride = require('method-override');
const ejsmate = require("ejs-mate");
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust"; --> it was to connect to localhost
const dbUrl = process.env.ATLASDB;
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
let {listingSchema} = require("./schema.js");
const Review = require("./models/reviews.js");
const Listing = require("../Backend/models/listing.js");
let {reviewSchema} = require("./schema.js");
const listing_route = require("./routes/listing_route.js");
const post_route = require("./routes/post_route.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");
const user_route = require("./routes/user_route.js");




// We make sure that the below line of code is at the very top of the middleware stack, else moongoose reads style.css as a query and gives
// CastError
app.use(express.static(path.join(__dirname, "/public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine("ejs", ejsmate);

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24 * 3600,
});

store.on("error", () => {
    console.log("Error in Mongo Session Store", err);
});



const sessionOptions = {
    store,
    secret : process.env.SECRET,
    resave: false,
    saveUninitialized : true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 3,
        maxAge: 1000 * 60 * 60 * 24 * 3,
        httpOnly: true
    }
}

app.use(session(sessionOptions));
app.use(flash());

// passport 
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    // console.log(res.locals.success);
    next();
})

main()
.then(()=>{
    console.log("connection successful");
})
.catch((err)=> console.log(err));




async function main() {
    // console.log(dbUrl);
    await mongoose.connect(dbUrl);
}

// app.use(express.static(path.join(__dirname, "/public")));


// app.get("/", (req,res)=>{
//     res.send("working!");
// })


// demo user for authentication dev
// app.get("/registerUser", async (req, res) => {
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "delta-student" 
//     });

//     let newUser = await User.register(fakeUser, "helloWorld!");
//     res.send(newUser);
// })


// listing routes
app.use("/listings", listing_route);

// posts routes
app.use("/listings/:id/reviews", post_route);

// user routes
app.use("/", user_route);


app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
})

app.use((err,req,res,next)=>{
    let {statusCode = 500, message = "hang ho gya!"} = err;
    // res.render("error.ejs", { message });
    res.status(statusCode).send(message);
    // res.send(message)
})

app.listen(8080, ()=>{
    console.log("App listening to port 8080");
})