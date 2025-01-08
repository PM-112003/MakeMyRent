const express = require("express");
const router = express.Router({mergeParams: true});
const listing = require("../models/listing.js");
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/reviews.js");
let {listingSchema, reviewSchema} = require("../schema.js");
const {isLoggedIn, isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/reviews_controller.js");

const validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    // console.log(result);
    if(error){
        let errmsg = error.details.map((el)=>el.message).join(",") // creates a to the point message error
        throw new ExpressError(400, error);
    } else{
        next();
    }
}

// Post review route
// isLoggedIn used for backend security
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

// Delete review route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync( reviewController.destroyReview))


module.exports = router;

