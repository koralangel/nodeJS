const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
const { string } = require("@hapi/joi");
//const { object } = require("@hapi/joi");





const adSchema = new mongoose.Schema({
    id_post: String,
    ad_number: Number,
    title: String,
    category: String,
    comment: String,
    date: { type: Date, default: Date.now },
    from_date: String,
    till_date: String,
    who_likes: [String],
    who_pass:[String],
    user: {},
    from_date_f: String
  
})

/// מייצא מודל שמחבר בין הקולקשן לסכמה שלו
exports.adModel = mongoose.model("ads", adSchema);





// // בדיקה שרת לפני ששולחים למסד נתונים את המידע שגם שם יש בדיקה
// // אחרונה
const validateAd = (_ad) => {
    const schema = Joi.object({
        id_post: Joi.string(),
        ad_number: Joi.number(),
        title: Joi.string(),
        category: Joi.string(),
        //who_likes: Joi.array().items(Joi.string()),
        comment: Joi.string(),
        date: Joi.string(),
        from_date: Joi.string(),
        till_date: Joi.string(),
        who_likes: Joi.array().items(Joi.string()),
        who_pass: Joi.array().items(Joi.string()),
        user: Joi.object(),
        from_date_f: Joi.string()
   
    })

    return schema.validate(_ad)
}

exports.validateAd = validateAd;