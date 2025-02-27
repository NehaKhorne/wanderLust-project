const User = require("../models/user");

module.exports.renderSingupForm = (req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.signup = async(req,res)=>{
    try{
        let {username,email,password} = req.body;
        const newUser = new User({email,username});
        const registeredUser = await User.register(newUser,password);
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","User registered successfully");
            res.redirect("/listings");
        })
        
    } catch (error){
        req.flash("error",error.message);
        res.redirect("/signup");
    }
    
  }

module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs");
}

module.exports.login = async(req,res)=>{
    req.flash("success","Welcome to WanderLust");
    res.redirect("/listings");
}

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you are logged out!");
        res.redirect("/listings");
    });
}