const jwt = require("jsonwebtoken");
const {userModel} = require("../models/user_model")
const config = require("config");
const { adminModel } = require("../models/admin_model");

const auth = async(req,res,next) => {
  //get -> req.query  //post -> req.body   //:id => req.params   // header -> req.header // דומה לבדיקה שאם בלוקאל סטורז' יש קיי בשם // X-AUTH-TOKEN בהידר
  // אנחנו מעדיפם במיידיל וויר לשלוח 
  // הידר ולא פוסט או גט מכיוון שאנחנו רוצים להתאים
  // את הפונקציה לכל סוג בקשה
  const token = req.header('x-auth-token');

   if(!token){
     return res.status(400).json({message:"You must send valid token! 1"})
   }
   try{
    // מתרגם את הטוקן לפי המפתח הסודי של מאנקיס במקרה שלנו
    let decoded = jwt.verify(token,config.get("tokenKey"));
    
    // מנסה לשלוף מהטוקן את היוזר לפי המייל ואיי די שלו
    let user = await userModel.findOne({email:decoded.email,_id:decoded._id});

    let userAdmin = await adminModel.findOne({email:decoded.email,_id:decoded._id})
    // בדוק אם קיים
    if(user){
      // שולח את המידע לפונקציה הבאה בנקסט בתוך המאפיין יוזרדאטא
      req.userData = user;
      next()
    }
    else if(userAdmin){
      req.userData = userAdmin;
      next()
    }
    else{
      // יש אי התאמה בין המידע בטוקן לדאטא בייס
      return res.status(400).json({message:"You must send valid token! 2"})
    }
  }
  catch(err){
    // יש טוקן אבל הוא לא תקין לעומת המפתח סודי שלי
    return res.status(400).json({message:"You must send valid token! 3"})
  }

}

module.exports = auth;