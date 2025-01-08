const Listing = require("../models/listing");
const Review = require("../models/reviews");


module.exports.createReview = async (req,res) => {
    let listing = await Listing.findById(req.params.id);

    if (!listing.geometry || !listing.geometry.type) {
        listing.geometry = {
            type: 'Point',
            coordinates: [0, 0], // Set default coordinates (you can customize this)
        };
    }

    let newReview = await Review(req.body.review);
    newReview.author = req.user._id;

    listing.review.push(newReview);

    await newReview.save();
    await listing.save();

    // console.log("new review saved");
    // res.send("new review saved");
    req.flash("success", "Review posted");
    res.redirect(`/listings/${listing._id}`);
}


module.exports.destroyReview = async(req,res)=>{
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {review: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted");
    res.redirect(`/listings/${id}`);
}