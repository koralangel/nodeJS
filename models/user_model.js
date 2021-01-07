const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
const jwt = require("jsonwebtoken");
const config = require("config");
const { boolean } = require("@hapi/joi");


const userSchema = new mongoose.Schema({
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
  height: String,
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
  ad_status: { type: Boolean, default: false },
  finish_registration: { type: Boolean, default: false },
  block_users: [], // חדש
  who_block: [String],
  block_status: { type: Boolean, default: false },
  vip: { 
    vip: { type: Boolean, default: false },
    long_vip: Number,
    time: { type: Date, default: Date.now }
  },
  match_user_list: [String],  // חדש
  my_ideal_person: {
    from_age: Number,
    to_age: Number,
    gender: String,
  },
  who_likes: [],
  who_pass: [],
  who_user_like: [],
  matching_ads: [{ name: String }], //  צריך לכתוב את כל הנתונים המאתימים למודעה
  registration_date: { type: Date, default: Date.now },
  // chat_box: [
  //   {match_user: {}, conversation: [{}]}
  // ]

})

/// מייצא מודל שמחבר בין הקולקשן לסכמה שלו
exports.userModel = mongoose.model("users", userSchema);

// // // מחולל תוקן לפי מידע שמקבל
const getUserToken = (_item) => {
  // תחתום את המידע כסודי והשתמש במילה מאנקיס כסודית
  // ככה שיהיה קשה לפענח את הטוקן הנל
  const token = jwt.sign(_item, config.get("tokenKey"));
  return token;
}

exports.getUserToken = getUserToken;



// // בדיקה שרת לפני ששולחים למסד נתונים את המידע שגם שם יש בדיקה
// // אחרונה
const validateUser = (_user) => {
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
    height: Joi.string().allow(''),
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
    ad_status: Joi.boolean().default(false),
    finish_registration: Joi.boolean().default(false),
    block_users: Joi.array(),  // חדש
    who_block: Joi.array().items(Joi.string()).allow(''),   // חדש
    block_status: Joi.boolean().default(false),
    vip: { 
      vip: Joi.boolean().default(false),
      long_vip: Joi.number().allow(''),
      time: Joi.date().allow('')
    },
    match_user_list: Joi.array().allow(''),   // חדש
    my_ideal_person: {
      from_age: Joi.number().allow(''),
      to_age: Joi.number().allow(''),
      gender: Joi.string().allow(''),
    },
    who_likes: Joi.array(),
    who_pass: Joi.array(),
    who_user_like: Joi.array(),
    matching_ads: Joi.array().allow(''),
    // chat_box: Joi.array().allow('')

    // [
    //   {id_match_user: String, conversation: []}
    // ]
  
  })

  return schema.validate(_user)
}

exports.validateUser = validateUser