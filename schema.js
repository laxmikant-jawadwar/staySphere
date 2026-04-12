const Joi = require("joi");

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.object({
            url : Joi.string().allow("",null)
        }),
        category: Joi.string().valid(
            "Trending",
            "Rooms",
            "Iconic Cities",
            "Mountains",
            "Castles",
            "Amazing Pools",
            "Camping",
            "Farms",
            "Arctic"
        ).required()
    }).required()
 });

 
module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required()
    }).required()
});

/* booking */
module.exports.bookingSchema = Joi.object({
  booking: Joi.object({
    userName: Joi.string().required(),
    mail: Joi.string().email().required(),
    dateFrom: Joi.date().required(),
    dateTo: Joi.date().greater(Joi.ref('dateFrom')).required(),
    numOfPeople: Joi.number().min(1).required()
  }).required()
});

