if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride =require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} = require("./schema.js");
const {reviewSchema} = require("./schema.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
// const { resolveAny } = require("dns");
const userRouter = require("./routes/user");
 

const dbUrl = process.env.ATLASDB_URL;

main().then(()=>{
    console.log("Connected to db");
}).catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(dbUrl);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter: 24 * 3600.
});

store.on("error",() =>{
    console.log("Error",err);
});

const seseionOptions = {
    store,
    secret: process.env.SECRET,
    resave : false,
    saveUninitialized: true,
    cookie :{ 
        expires : Date.now() + 7 * 24 * 60 *60 *1000,
        maxAge : 7 * 24 * 60 *60 *1000,
        httpOnly : true
    }
};



// app.get("/",(req,res)=>{
//     res.send("Hello World");
// });

app.use(session(seseionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    // console.log(res.locals.success);
    res.locals.currUser = req.user;
    
    // console.log(res.locals.currUser);
    next();
})

// app.get("/demouser" ,async (req,res)=>{
//     let fakeUser = new User ({
//         email: "student@gmail.com",
//         username : "delta-student",

//     });

//     let registeredUser = await User.register(fakeUser,"helloworld");
//     res.send(registeredUser);
// })

// const validateListing = (req,res,next) =>{
//     let {error} = listingSchema.validate(req.body);
//     if(error){
//         let errMsg = errMsg = error.details.map((el)=>el.message).join(",")
//         throw new ExpressError(404,error);
//     } else{
//         next();
//     }
// };

// const validateReview = (req,res,next) =>{
//     let {error} = reviewSchema.validate(req.body);
//     if(error){
//         throw new ExpressError(404,error);
//     } else{
//         next();
//     }
// }

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

// app.get("/testListing",async (req,res)=>{
//     let sampleListing = new Listing({
//         title : "My new villa",
//         description: "By the beach",
//         price : 12000,
//         location:"Calangute,Goa",
//         country:"India",
//     });
//     sampleListing.save();
//     console.log("sampleListing");
//     res.send("Success");
// });

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not Found!"));
})

app.use((err,req,res,next)=>{
    let {status=500,message="Something went wrong!!"}=err;
    // res.status(status).send(message);
    res.status(status).render("error.ejs",{message});
});

app.listen(8080,()=>{
    console.log("Server is listening on 8080");
});