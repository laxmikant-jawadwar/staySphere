const mongoose = require("mongoose");
const Schema = mongoose.Schema ; //need it repeatedly thats why simplify var name.
const Review = require("./review.js");

const listingSchema = new Schema({
    title: {
        type : String,
        required : true 
    },
    description : String,
    image : {
        filename:{
            type : String,
            default : "listingimage"
        },
        url:{
            type : String,
            default : "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dmlsbGF8ZW58MHx8MHx8fDA%3D",
             //default is if img prop is not provided by user means img prp value is undefined then takes this default value.
            // set : (v) => v === "" ? "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dmlsbGF8ZW58MHx8MHx8fDA%3D" : v   
            // // set : img is send by user but it is empty then it sets given otherwise user provided img url.    
        }
    },
    price : Number,
    country : String,
    location : String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review" //model name not schema name
        }
    ],
    owner:{
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    geometry:{
        type:{
            type: String,
            enum: ['Point'], //location type must be "Point"
            required: true  
        },
        coordinates:{
            type: [Number],
            required: true
        }
    },
    category:{
        type:String,
        enum:["Trending","Rooms","Iconic Cities","Mountains","Castles","Amazing Pools","Camping" ,"Farms" ,"Arctic" ],
        required:true
    }
});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
       await Review.deleteMany({_id: {$in : listing.reviews}});
    }
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing ; 