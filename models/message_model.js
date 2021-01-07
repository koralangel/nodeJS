const mongoose = require("mongoose");
const Joi = require("@hapi/joi");





const messageSchema = new mongoose.Schema({
    userPost: {id: String, img: String, name: String, date_of_birth: String},
    userGet: {id: String, img: String, name: String, date_of_birth: String},
    chatMsg: {nowTime:String, msg: String}

})

/// מייצא מודל שמחבר בין הקולקשן לסכמה שלו
exports.messageModel = mongoose.model("message", messageSchema);





// // בדיקה שרת לפני ששולחים למסד נתונים את המידע שגם שם יש בדיקה
// // אחרונה
const validateMessage = (_report) => {
    const schema = Joi.object({
        userPost: {id: Joi.string().allow(""), img: Joi.string().allow(""),name: Joi.string().allow(""), date_of_birth: Joi.string().allow("") },
        userGet: {id: Joi.string().allow(""), img: Joi.string().allow(""),name: Joi.string().allow(""), date_of_birth: Joi.string().allow("") },
        chatMsg: {nowTime: Joi.string().allow(""), msg: Joi.string().allow("")}
    })

    return schema.validate(_report)
}

exports.validateMessage = validateMessage;