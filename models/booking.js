const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    listing:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Listing",
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    userName: String,
    mail: String,

    dateFrom: Date,
    dateTo: Date,

    numOfPeople: Number,

    status: {
        type: String,
        enum: ["confirmed", "cancelled"],
        default: "confirmed"
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model("Booking", bookingSchema);
