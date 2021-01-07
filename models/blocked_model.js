const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
//const { object } = require("@hapi/joi");





const blockedSchema = new mongoose.Schema({
    email: String,
    password: String,
    first_name: String,
    phone: String,
    gender: String,
    image: [String],
    pets: String,
    country: { type: String, default: "Isreal" },
    city: String,
    date_of_birth: String,
    about_me: String,
    height: Number,
    speaks: [String],
    smoking: String,
    drinking: String,
    marijuana: String,
    children: String,
    body_type: String,
    education: String,
    relationship: String,
    relationship_type: String,
    orientation: String,
    my_traits: String,
    hobbies: String,
    categories: [String],
    finish_registration: { type: Boolean, default: false },
    vip: { type: Boolean, default: false },
    my_ideal_person: {
      from_age: Number,
      to_age: Number,
      orientation: String,
      gender: String
    },
    matching_ads: [{ name: String }], //  צריך לכתוב את כל הנתונים המאתימים למודעה
    registration_date: { type: Date, default: Date.now },
})

/// מייצא מודל שמחבר בין הקולקשן לסכמה שלו
exports.blockedModel = mongoose.model("blockeds", blockedSchema);





// // בדיקה שרת לפני ששולחים למסד נתונים את המידע שגם שם יש בדיקה
// // אחרונה
const validateBlocked = (_blocked) => {
    const schema = Joi.object({
        email: Joi.string().min(5).max(80).email(),//.required(),
        password: Joi.string(),//.min(8).max(32).required(),
        first_name: Joi.string().min(2).max(30),//.required(),
        phone: Joi.string().pattern(new RegExp(/^05\d([-]{0,1})\d{7}$/)),
        gender: Joi.string(),
        image: Joi.array().items(Joi.string()),//.required(),
        pets: Joi.string().allow(''),
        city: Joi.string(),
        date_of_birth: Joi.string(),
        about_me: Joi.string().allow(''),
        height: Joi.number().min(3).allow(''),
        speaks: Joi.array().items(Joi.string()).allow(''),
        smoking: Joi.string().allow(''),
        drinking: Joi.string().allow(''),
        marijuana: Joi.string().allow(''),
        body_type: Joi.string().allow(''),
        education: Joi.string().allow(''),
        relationship: Joi.string().allow(''),
        relationship_type: Joi.string().allow(''),
        orientation: Joi.string().allow(''),
        my_traits: Joi.string().allow(''),
        hobbies: Joi.string().allow(''),
        children: Joi.string().allow(''),
        categories: Joi.array().items(Joi.string()).allow(''),
        finish_registration: Joi.boolean().default(false),
        vip: Joi.boolean().default(false),
        my_ideal_person: {
          from_age: Joi.number().allow(''),
          to_age: Joi.number().allow(''),
          orientation: Joi.string().allow(''),
          gender: Joi.string().allow(''),
        },
        matching_ads: Joi.array().allow('')
   
    })

    return schema.validate(_blocked)
}

exports.validateBlocked = validateBlocked;