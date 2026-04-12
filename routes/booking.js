const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn , isOwner ,validateListing } = require("../middleware.js");
const bookingController = require("../controllers/bookings.js");
 


//to see bookings details from notification 
router 
    .get(
        "/:id/details",
        wrapAsync(bookingController.bookingDetails)
    );    

    
router
    //show booking page 
    .get(
    "/:id",
        wrapAsync( bookingController.renderNewBookingForm)
    )
    .post(
        "/:id",
        wrapAsync( bookingController.createBooking)
    )
    .delete(
        "/:id",
        wrapAsync(bookingController.cancelBooking)
    )


router 
   //booking confirm page 
    .get(
        "/:bookingId/success",
        wrapAsync(bookingController.successBooking)
    );



module.exports =router;