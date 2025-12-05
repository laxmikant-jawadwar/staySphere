const Listing = require("../models/listings");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken});

module.exports.index = async (req, res) => {

    const { category } = req.query;
    let filter = category;
    let allListings ;

    if (!category) {
        allListings = await Listing.find({});
    } else {
        allListings = await Listing.find({ category :category });

        // If no results then set flash
        if (allListings.length === 0) {
            req.flash("error", `No listings found for "${category}"`);
            return res.redirect("/listings");
        }
    }

    res.render("listings/index.ejs", { allListings, filter });
};

module.exports.searchResult = async(req,res)=>{
    let {field,q} = req.query; 
    
    if (!field || !q) {
      req.flash("error", "Please select a field and enter search text.");
      return res.redirect("/listings");
    }

    const allowed = ["title", "country", "location"];
    if (!allowed.includes(field)) {
      req.flash("error", "Invalid search field.");
      return res.redirect("/listings");
    }

    let str = q.trim().toLowerCase();

  let filter = {};

  // Case insensitive + partial matching using $regex
  if (field === "location") {
    // City search logic – match anywhere inside location
    filter[field] = { $regex: str, $options: "i" }; //"i" => ignore casesensitivity
  } else {
    // title or country
    filter[field] = { $regex: "^" + str, $options: "i" }; //"^" + str =>shoud start with str
  }

  const allListings = await Listing.find(filter);

  // If empty results, show flash message
  if (allListings.length === 0) {
    req.flash("error", "No listings found for your search.");
    return res.redirect("/listings");
  }

  res.render("listings/index.ejs", { allListings, filter: undefined });
}

module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new.ejs");
}

module.exports.showListing = async (req,res,next)=>{
    let {id} = req.params ;
    const listing = await Listing.findById(id)
    //review and author populate using Nested Populate
        .populate({
            path:"reviews",
            populate:{path:"author"}
        })
        .populate("owner");
    if(!listing){
        req.flash("error","listing you requested for does not exist or deleted !");
        return res.redirect("/listings");
    }
    // console.log(listing);
    res.render("listings/show.ejs",{listing});  
}

module.exports.createListing = async (req,res,next)=>{

    let response = await  geocodingClient
        .forwardGeocode({
            query: req.body.listing.location ,
            limit: 1
        })
        .send();


    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing); 
    newListing.owner = req.user._id; //req.user._id  stores cur user id
    newListing.image ={filename,url}; 

    newListing.geometry = response.body.features[0].geometry;

    let savedListing = await newListing.save();
    // console.log(savedListing);

    req.flash("success","New Listing Created !");
    res.redirect("/listings");//redirect always send a get request
}

module.exports.renderEditForm = async (req,res)=>{
    let {id} = req.params ;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","listing you requested for does not exist or deleted !");
        return res.redirect("/listings");
    }
    //to show prev image with low pixels
    let originalImageUrl = listing.image.url.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs",{listing,originalImageUrl});
}

module.exports.updateListing = async (req,res)=>{
        let {id} = req.params ;
        let listing = await  Listing.findByIdAndUpdate(id,{...req.body.listing});
        
        if(typeof req.file !== "undefined"){
            let url = req.file.path;
            let filename = req.file.filename;
            listing.image = {filename,url};
            await listing.save();
        }
        req.flash("success","Listing Updated !");
        res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req,res)=>{
        let {id} = req.params;
        const deletedListing = await Listing.findByIdAndDelete(id);
        console.log(deletedListing);
        req.flash("success","Listing Deleted Successfully !");
        res.redirect("/listings");
}