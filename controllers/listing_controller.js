const listing = require("../models/listing");
const Listing = require("../models/listing");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken});

module.exports.index = async (req,res,next)=>{
    let allListings = await listing.find({});
    // res.send(allListings);
    res.render("./listings/index.ejs", {allListings});
}

module.exports.renderNewForm = (req,res)=>{
    res.render("./listings/new.ejs");
}


module.exports.showListing = async (req,res,next)=>{
    let {id} = req.params;
    let item = await listing.findById(id).populate({
        path: "review",
        populate: {
            path: "author",
        },
    }).populate("owner");
    if(!item){
        req.flash("error", "Listing you requested for does not exists");
        res.redirect("/listings");
    }
    res.render("./listings/show.ejs", {item});
}


module.exports.createListing = async (req,res,next)=>{
    let response = await geocodingClient.forwardGeocode({
        query: req.body.location,
        limit: 1,
      })
        .send();

    let url = req.file.path;
    let filename = req.file.filename;
    let newlisting = new listing(req.body);
    newlisting.owner = req.user._id;
    newlisting.image = {url, filename};
    newlisting.geometry = response.body.features[0].geometry,
    // console.log(newlisting);
    await newlisting.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
}


module.exports.renderEditForm = async(req,res,next)=>{
    let {id} = req.params;
    let item = await listing.findById(id);
    if(!item){
        req.flash("error", "Listing you requested for does not exists");
        res.redirect("/listings");
    }
    res.render("./listings/edit.ejs", {item});
}


module.exports.updateListing =  async(req,res,next)=>{
    // if(!req.body){
    //     throw new ExpressError(400, "Send Valid data for listing!")
    // 
    let {id} = req.params;
    // let item = await Listing.findById(id);
    let listing = await Listing.findByIdAndUpdate(id, {...req.body});

     // Ensure geometry is set (fallback logic)
     if (!listing.geometry || !listing.geometry.coordinates) {
        listing.geometry = {
            type: 'Point',
            coordinates: [0, 0], // Set default coordinates (you can customize this)
        };
    }
    
    if(typeof req.file != "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }
    req.flash("success", "Listing updated");
    res.redirect(`/listings/${id}`);
}


module.exports.destroyListing = async(req,res,next)=>{
    let {id} = req.params;
    let deletedlist = await listing.findByIdAndDelete(id);
    // console.log(deletedlist);
    req.flash("success", "Listing deleted");
    res.redirect("/listings");
}