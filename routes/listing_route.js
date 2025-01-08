const express = require("express");
const app = express();
const router = express.Router();
const listing = require("../models/listing.js");
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
// const Review = require("./models/reviews.js");
let {listingSchema, reviewSchema} = require("../schema.js");
const {isLoggedIn, isOwner} = require("../middleware.js");
const { index, renderNewForm, showListing, createListing, renderEditForm, updateListing, destroyListing } = require("../controllers/listing_controller.js");
const { storage } = require("../cloudConfig.js");
const multer = require("multer");
const upload = multer({ storage});

const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    // console.log(result);
    if(error){
        let errmsg = error.details.map((el)=>el.message).join(",") // creates a to the point message error
        throw new ExpressError(400, error);
    }
    else{
        next();
    }
}


// index route
router.get("/", wrapAsync(index));

// new route
router.get("/new", isLoggedIn, renderNewForm);

// we put create route above the show route to avoid the "new" in the create route to be treated as id


// show route
router.get("/:id", wrapAsync(showListing));

// create route
router.post("/", isLoggedIn, upload.single('image'), validateListing,
    wrapAsync (createListing)
);

// router.post("/",  (req, res) => {
//     res.send(req.file);
// });

router.get("/:id/edit", isLoggedIn, isOwner,
    wrapAsync(renderEditForm));


//update route
router.put("/:id", isLoggedIn, isOwner, upload.single('image'), validateListing,
    wrapAsync(updateListing));

//delete route
router.delete("/:id", isOwner, isLoggedIn,
    wrapAsync(destroyListing));


module.exports = router;