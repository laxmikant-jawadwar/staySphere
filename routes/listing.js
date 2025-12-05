const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn , isOwner ,validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js")
const upload = multer({storage}) ;; //storage is where actually storing it.

router
    .route("/")
    .get(wrapAsync(listingController.index)) //Index route (which show all listings)
    .post(                  //create route (to post form data in db)
        isLoggedIn, 
        upload.single("listing[image]"),  //first multer parse img => save to cloudinary then we get image url,filename tthen validateListing
        validateListing,
        wrapAsync(listingController.createListing)
    );


// New route (to render creating form to user)
router.get("/new",isLoggedIn,listingController.renderNewForm);
//search route
router.get("/search",
    wrapAsync( listingController.searchResult)
);
router
    .route("/:id")
    .get(wrapAsync(listingController.showListing)) //Show route
    .put( //update route
        isLoggedIn,
        isOwner,
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(listingController.updateListing)
    )
    .delete(    //DELETE Route
        isLoggedIn,
        isOwner,
        wrapAsync(listingController.destroyListing)
    );


//Edit Route (renders form )
router.get(
    "/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync( listingController.renderEditForm)
);


module.exports =router;