const Listing = require("./models/listing.js");
const Review = require("./models/reviews.js");

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be logged in!");
        return res.redirect("/login");
    }
    next();
}


module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }

    next();
}


// For checking the ownership of a listing
module.exports.isOwner = async (req, res, next) => {
    let {id} = req.params;
    let item = await Listing.findById(id);
    if(!item.owner.equals(res.locals.currUser._id)){
        req.flash("error", "You don't have permission to edit");
        return res.redirect(`/listings/${id}`);
    }

    next();
}


module.exports.isReviewAuthor = async (req, res, next) => {
    let {id, reviewId} = req.params;
    let item = await Review.findById(reviewId);
    if(!item.author.equals(res.locals.currUser._id)){
        req.flash("error", "You don't have permission to delete!");
        return res.redirect(`/listings/${id}`);
    }

    next();
}