const Review = require("../models/reviews");
const Listing = require("../models/listing.js");

module.exports.createReview = async(req,res)=>{
    let listings = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listings.reviews.push(newReview);
    await newReview.save();
    await listings.save();
    req.flash("success","New Review Created!");
    res.redirect(`/listings/${listings._id}`)
}

module.exports.deleteReview = async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,
        {$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    console.log(reviewId);
    req.flash("success","Review Deleted!");
    res.redirect(`/listings/${id}`);
}