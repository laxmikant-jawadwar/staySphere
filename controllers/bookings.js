const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn , isOwner ,validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js")
const upload = multer({storage}) ;; //storage is where actually storing it.

const Listing = require("../models/listings");

module.exports.renderNewBookingForm = async (req,res)=>{
    const listing = await Listing.findById(req.params.id);
    
    const today = new Date().toISOString().split("T")[0];

    res.render("bookings/new", { listing, today });

}


const Booking = require("../models/booking");

module.exports.createBooking = async (req, res) => {
    const { id } = req.params;
    const { booking } = req.body;

    const newBooking = new Booking({
        ...booking,
        listing: id,
        user: req.user._id
    });

    await newBooking.save();
    console.log("Booking Saved:", newBooking._id);
    res.redirect(`/bookings/${newBooking._id}/success`);
};
module.exports.successBooking = async (req, res) => {
    const booking = await Booking.findById(req.params.bookingId);
    res.render("bookings/success.ejs", { booking });
}
