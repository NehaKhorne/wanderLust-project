const express = require("express")
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema,reviewSchema} = require("../schema.js");
const Review = require("../models/reviews");
const Listing = require("../models/listing.js");
const { isLoggedIn , isReviewAuthor} = require("../views/middleware.js");
const reviewController = require("../controllers/reviews.js");

const validateReview = (req,res,next) =>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(404,error);
    } else{
        next();
    }
}

//REVIEW ROUTE //post rouet
router.post("/",isLoggedIn,validateReview, wrapAsync(reviewController.createReview));

//delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.deleteReview));

module.exports = router;