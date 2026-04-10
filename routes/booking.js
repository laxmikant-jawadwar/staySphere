const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn , isOwner ,validateListing } = require("../middleware.js");
const bookingController = require("../controllers/bookings.js");
 

//show booking page 
router
    .get(
    "/:id",
        wrapAsync( bookingController.renderNewBookingForm)
    )
    .post(
        "/:id",
        wrapAsync( bookingController.createBooking)
    );

//booking confirm page
router  
    .get(
        "/:bookingId/success",
        wrapAsync(bookingController.successBooking)
    );


module.exports =router;