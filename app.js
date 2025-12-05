if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}
const express = require("express");
const app = express() ;
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo").default; //MongoDb based session store
const flash = require("connect-flash"); //instead use express-flash because connect is old library.
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));//
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


//const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust" ;

// Cloud MongoDB Atlas URL (from .env)
const dburl = process.env.ATLASDB_URL ;

// SESSION STORE (connect-mongo)
const store = MongoStore.create({
        mongoUrl: dburl,
        crypto:{
             secret: process.env.SECRET,  // for encrypting session data
        },
        touchAfter: 24*3600 // Time in s , Update session only once every 24 hours
         
});
//the max lifetime of the session stored in db is 14days if not set.
//after 14days atlas deletes session doc if none of its activity found

store.on("error",(err)=>{
    console.log("Error in Mongo Session Store",err);
});

const sessionOptions ={
    store,
    secret: process.env.SECRET,    // Required by express-session
    resave: false,
    saveUninitialized:false,
    // saveUninitialized: true => Create a new session for every request,
    //  even if you didn’t store anything in session.”
    cookie:{
        expires: Date.now() + 7*24*60*60*1000 ,//ms,browser Cookie expiration (7 days)
        maxAge: 7*24*60*60*1000,
        httpOnly:true,  //Prevents client-side JS from accessing cookies
    },
}

async function main(){
   await mongoose.connect(dburl);
}

main()
    .then(()=>{
    console.log("Db is connected");
    })
    .catch((err)=>{
        console.log(err);
    });

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.curUser = req.user; // passport stores cur user in req.user
    next();
});

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);


// 404 handler for unmatched routes (Express v5 safe)
//if any route is not matched above then controll comes here 
app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found !"));
});

app.use((err,req,res,next)=>{
    let{statusCode=500,message="Something Went Wrong" } = err;
    res.status(statusCode).render("Error.ejs",{err});
});

app.get("/",()=>{
    res.redirect("/listings");
})

app.listen(8080,()=>{
    console.log("App is listening on port 8080");
});
