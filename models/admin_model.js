const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
const jwt = require("jsonwebtoken");
const config = require("config");

const adminSchema = new mongoose.Schema({
  email: String,
  password: String,
  first_name: String,
  phone: String,
  gender: String,
  image: String,
  country: {type:String, default: "Isreal"},
  city: String,
  date_of_birth: String, 
  owner: { type: Boolean, default: false },     
  registration_date: { type: Date, default: Date.now },
})


/// מייצא מודל שמחבר בין הקולקשן לסכמה שלו
exports.adminModel = mongoose.model("admins", adminSchema);

// // // מחולל תוקן לפי מידע שמקבל
const getAdminToken = (_item) => {
  // תחתום את המידע כסודי והשתמש במילה מאנקיס כסודית
  // ככה שיהיה קשה לפענח את הטוקן הנל
  const token = jwt.sign(_item,config.get("tokenKey"));
  return token;
}

exports.getAdminToken = getAdminToken;



// // בדיקה שרת לפני ששולחים למסד נתונים את המידע שגם שם יש בדיקה
// // אחרונה
const validateAdmin = (_admin) => {
  const schema = Joi.object({   
    email:Joi.string().min(5).max(80).email().required(),
    password: Joi.string().min(8).max(32).required(),
    first_name: Joi.string().min(2).max(30).required(),
    phone: Joi.string().pattern(new RegExp(/^05\d([-]{0,1})\d{7}$/)),
    gender: Joi.string(),
    image: Joi.string(),
    country: Joi.string(),
    city: Joi.string(),
    date_of_birth: Joi.string(),
    owner: Joi.boolean().default(false),      
  }) 


  return schema.validate(_admin)
}

exports.validateAdmin = validateAdmin;