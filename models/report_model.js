const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
//const { object } = require("@hapi/joi");





const reportSchema = new mongoose.Schema({
    name: String,
    image: String,
    title: String,
    info: String,
    user_report_id: String,
    reported_id: String,
    date: { type: Date , default: Date.now}

})

/// מייצא מודל שמחבר בין הקולקשן לסכמה שלו
exports.reportModel = mongoose.model("report", reportSchema);





// // בדיקה שרת לפני ששולחים למסד נתונים את המידע שגם שם יש בדיקה
// // אחרונה
const validateReport = (_report) => {
    const schema = Joi.object({
        name: Joi.string(),
        image: Joi.string(),
        title: Joi.string(),
        info: Joi.string().allow(''),    // חדש
        user_report_id: Joi.string.allow(''),
        reported_id: Joi.string(),
        date: Joi.string(),

    })

    return schema.validate(_report)
}

exports.validateReport = validateReport;