const express = require("express")
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema,reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner} = require("../views/middleware");
const currUser = require("../app.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

const validateListing = (req,res,next) =>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = errMsg = error.details.map((el)=>el.message).join(",")
        throw new ExpressError(404,error);
    } else{
        next();
    }
};


// router.get("/", async (req, res) => {
//     console.log("🟢 Search Route Triggered!"); // Debugging

//     try {
//         const searchQuery = req.query.search || "";
//         console.log("🔍 Received Search Query:", searchQuery); // Debugging

//         const listings = await Listing.find({
//             $or: [
//                 { title: { $regex: new RegExp(searchQuery, "i") } },
//                 { location: { $regex: new RegExp(searchQuery, "i") } },
//                 { country: { $regex: new RegExp(searchQuery, "i") } }
//             ]
//         });

//         console.log("✅ Search Results Found:", listings.length, listings); // Debugging
//         res.json(listings);
//     } catch (error) {
//         console.error("❌ Search Error:", error);
//         res.status(500).json({ error: "Server error" });
//     }
// });



//INDEX ROUTE
router.get("/",wrapAsync(listingController.index));

//NEW ROUTE
router.get("/new",isLoggedIn,listingController.renderNewForm);

//SHOW ROUTE
// router.get("/:id", wrapAsync(listingController.showListing));

//Create Route
router.post("/",
    isLoggedIn,
    upload.single("listing[image]")
    ,wrapAsync(listingController.createListing));
// router.post("/",upload.single("listing[image]"),(req,res)=>{
//     res.send(req.file);
// });

//Edit Route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));

//show route
router.get("/:id", wrapAsync(listingController.showListing));

//UPDATE ROUTE
router.put("/:id",isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(listingController.updateListing));

//DELETE ROUTE
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.delete));


module.exports = router;