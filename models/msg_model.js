const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
const { string, boolean } = require("@hapi/joi");
//const { object } = require("@hapi/joi");





const msgSchema = new mongoose.Schema({
    userA: {name: String, date_of_birth: String, city: String, id: String, img: String},
    userB: {name: String, date_of_birth: String, city: String, id: String, img: String},
    messages: [{userPost: String, time: String, msg: String}],
    userAId: String,
    userBId: String,
    lastTimeChat: String,
    admin_status: { type: Boolean, default: false }
})

/// מייצא מודל שמחבר בין הקולקשן לסכמה שלו
exports.msgModel = mongoose.model("msgs", msgSchema);





// // בדיקה שרת לפני ששולחים למסד נתונים את המידע שגם שם יש בדיקה
// // אחרונה
const validateMsg = (_msg) => {
    const schema = Joi.object({
        userA: Joi.object(),
        userB: Joi.object(),
        messages: Joi.array(),
        userAId: Joi.string(),
        userBId: Joi.string(),
        lastTimeChat: Joi.string(),
        admin_status: Joi.boolean().default(false)
    })

    return schema.validate(_msg)
}

exports.validateMsg = validateMsg;