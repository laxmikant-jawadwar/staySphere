const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn , isOwner ,validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const Notification = require("../models/notification");

const upload = multer({storage}) ; //storage is where actually storing it.
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
    const listing = await Listing.findById(id);

    const newBooking = new Booking({
        ...booking,
        listing: id,
        user: req.user._id,
        status: "confirmed"
    });

    await newBooking.save();
    // CREATE NOTIFICATION
    const notification = new Notification({
        user: listing.owner, //  owner gets notification
        message: `${req.user.username} booked your ${listing.title}`,
        booking: newBooking._id
    });

    await notification.save();
    req.flash("success", "Booking successful!");
    res.redirect(`/bookings/${newBooking._id}/success`);
};



module.exports.successBooking = async (req, res) => {
    const booking = await Booking.findById(req.params.bookingId);
    res.render("bookings/success.ejs", { booking });
}


module.exports.cancelBooking = async (req, res) => {
    const { id } = req.params;

    const booking = await Booking.findById(id);

    if (!booking) {
        req.flash("error", "Booking not found");
        return res.redirect("/profile");
    }

    // OPTIONAL: security check
    if (!booking.user.equals(req.user._id)) {
        req.flash("error", "Unauthorized action");
        return res.redirect("/profile");
    }

    booking.status = "cancelled";
    await booking.save();

    req.flash("success", "Booking cancelled successfully");
    res.redirect("/profile");
};

module.exports.bookingDetails = async (req, res) => {
    const booking = await Booking.findById(req.params.id)
        .populate("user")
        .populate("listing");

    res.render("bookings/show", { booking });
};
