const Listing = require("../models/listing");
const Review = require("../models/reviews");
const currUser = require("../app");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema,reviewSchema} = require("../schema.js");

module.exports.isLoggedIn=(req,res,next) =>{
    if(!req.isAuthenticated()){
        // console.log(req.path ,".." ,req.originalUrl);
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must be logged in to create a new listing");
        return res.redirect("/login")
    }
    next();
}

module.exports.saveRedirectUrl = (req,res, next)=>{
    if(req.session.redirectUrl) { 
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing || !listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error","You don't have permission to edit");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async (req,res,next)=>{
    let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)) {
        req.flash("error","You don't have permission to delete");
        return res.redirect(`/listings/${id}`);
    }
    next();
}