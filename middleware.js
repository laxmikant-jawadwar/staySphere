const Listing = require("./models/listings.js");
const Review = require("./models/review.js");
const {listingSchema , reviewSchema} = require("./schema.js"); //for server side validation
const ExpressError = require("./utils/ExpressError.js");

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl ; 
        //created & initialized a var in session object.
        req.flash("error","Please Logged In first");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
        //storing the url because after login passport reset the session object.
        //so our created var no more access,
    }
    next();
}

module.exports.isOwner = async (req,res,next)=>{
    let {id} = req.params ;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.curUser._id)){
        req.flash("error","You are not owner of this listing.");
       return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async (req,res,next)=>{
    let {id,reviewId} = req.params ;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.curUser._id)){
        req.flash("error","You are not author of this review.");
       return res.redirect(`/listings/${id}`);
    }
    next();
}

//server side valildation via Joi for listing
module.exports.validateListing = (req,res,next)=>{
    const {error} = listingSchema.validate(req.body); //after executing destructuring only error part.
    if(error){
          throw new ExpressError(400,error);
    }else{
        next(); //if not occured error then go to non-error handler route/middleware.
    }
}

//server side valildation via Joi for review
module.exports.validateReview = (req,res,next)=>{
    const {error} = reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }else{
        next();
    }
}