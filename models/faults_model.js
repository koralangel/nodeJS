const mongoose = require("mongoose");
const Joi = require("@hapi/joi");





const faultSchema = new mongoose.Schema({
    first_name: String,
    email: String,
    fault_type: String,
    fault_description: String,
    admin_name: String,
    date: { type: Date, default: Date.now }
})

/// מייצא מודל שמחבר בין הקולקשן לסכמה שלו
exports.faultModel = mongoose.model("faults", faultSchema);


// // בדיקה שרת לפני ששולחים למסד נתונים את המידע שגם שם יש בדיקה
// // אחרונה
const validateFault = (_fault) => {
    const schema = Joi.object({
        first_name: Joi.string(),
        email: Joi.string(),
        fault_type: Joi.string(),
        fault_description: Joi.string(),
        admin_name: Joi.string()
    })

    return schema.validate(_fault)
}

exports.validateFault = validateFault;
