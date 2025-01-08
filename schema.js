const joi = require('joi');

module.exports.listingSchema = joi.object({
    title : joi.string().required(),
    description : joi.string().required(),
    location : joi.string().required(),
    country : joi.string().required(),
    price : joi.number().required().min(0)
    // Since image is uploaded as a file (via Multer), it is not part of req.body. 
    // Therefore, you don't need to validate it as part of the Joi schema.
});

module.exports.reviewSchema = joi.object({
    review: joi.object({
        rating: joi.number().required().min(1).max(5),
        comment: joi.string().required(),
    }).required(),
})