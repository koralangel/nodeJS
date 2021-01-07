const mongoose = require("mongoose");
const Joi = require("@hapi/joi");





const citiesSchema = new mongoose.Schema({
    city_name:String,
    area:String
})

/// מייצא מודל שמחבר בין הקולקשן לסכמה שלו
exports.citiesModel = mongoose.model("cities", citiesSchema);





// // בדיקה שרת לפני ששולחים למסד נתונים את המידע שגם שם יש בדיקה
// // אחרונה
const validateCities = (_cities) => {
    const schema = Joi.object({
        city_name:Joi.string().allow(''),
        area:Joi.string().allow('')
    })

    return schema.validate(_cities)
}

exports.validateCities = validateCities;