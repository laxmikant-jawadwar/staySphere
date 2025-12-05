const User = require("../models/user.js");

module.exports.renderSignupForm = (req,res)=>{ 
    res.render("users/signup.ejs");
}

module.exports.signup = async (req, res, next) => { 
    try {
        let {username,email,password} = req.body;
        const newUser = new User({email,username});
        console.log(newUser);
        const registeredUser = await User.register(newUser, password);
        // console.log(registeredUser);
        req.login(registeredUser,(err)=>{ 
        //login(user,cb) is passport provided method on req like logout(cb) .
        if(err){
            return next(err);
        }
        req.flash("success", "Welcome to WanderLust!");
        res.redirect("/listings");
        })
    } catch (err) {
        console.log("Error Occured");
        console.dir(err);
        req.flash("error", err.message);
        res.redirect("/signup");
    }
}

module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs");
} 

module.exports.login = async (req,res)=>{
       req.flash("success","Welcome back to WanderLust!");
       let redirectUrl = res.locals.redirectUrl || "/listings"
       //if res.locals.redirectUrl have then store it otherwise store "/listing"
       res.redirect(redirectUrl);
}  

module.exports.logout = (req,res,next)=>{
  req.logout((err)=>{ //req.logout(callback) if callback was err then handled it.
      if(err){
        return next(err);
      }
      req.flash("success","You Are Logged Out!");
      res.redirect("/listings");
  })
}