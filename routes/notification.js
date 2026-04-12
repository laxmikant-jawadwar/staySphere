const express = require("express");
const router = express.Router();
const Notification = require("../models/notification");

// Show all notifications
router.get("/notifications", async (req, res) => {

    const notifications = await Notification.find({ user: req.user._id })
        .sort({ createdAt: -1 });

    // mark all as read
    await Notification.updateMany(
        { user: req.user._id }, 
        { isRead: true }
    );
    res.render("notification/index", { notifications });
});

module.exports = router;