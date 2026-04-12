const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const privacyAndTermsController = require("../controllers/privacyAndTerms")

router
    .route("/privacy")
    .get(wrapAsync(privacyAndTermsController.privacy));

router
    .route("/terms")
    .get(wrapAsync(privacyAndTermsController.terms));    


    module.exports = router;