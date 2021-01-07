const express = require('express');
const router = express.Router();
const {adminModel,validateAdmin,getAdminToken} = require("../models/admin_model")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const config = require("config");
const auth= require("../middleware/auth")
const { blockedModel } = require('../models/blocked_model');

//בדיקה בלבד אחרי זה למחוק מהפרויקט
router.get('/', (req, res, next) => {
  adminModel.find({})
    .then(data => {
      res.json(data)
    })
    .catch(err => {
      // חשוב לשלוח סטטוס 400 כדי שבצד לקוח הוא יתפוס אותו בקצ' של הפיטץ'
      res.status(400).json(err)
    })

});


// הוספת משתמש חדש
router.post("/add", async (req, res) => {
    // בדיקה שבכלל המידע שנשלח בפוסט תקין לפי הג'וי
    let validAdmin = await validateAdmin(req.body);
    if (validAdmin.error) {
      return res.status(400).json(validAdmin.error.details[0]);
    }
    let blockUser = await blockedModel.findOne({ email: req.body.email });
    // רמת הצפנה בשביל הביקריפט 10 זה ממוצע ומספיק טוב לאבטחה
    const salt = await bcrypt.genSalt(10);
    // הגדרנו שהסיסמא תיהיה מוצפנת
    req.body.password = await bcrypt.hash(req.body.password, salt);
  
    try {
      if(blockUser===null){
      let saveData = await adminModel.insertMany([req.body]);
      res.json(_.pick(saveData[0], ["_id", "email"]));
      }
      else{
        throw res.status(400).json({ message: "error insert new user" })
       }
    }
    catch{
      res.status(400).json({ message: "error insert new user" })
    }
  })
  
  
  // התחברות
  router.post("/login", async (req, res) => {
    // משווה את המתשנה יוזר למידע של חיפוש משתמש
    //SELECT * FROM users where email = req.body.email
    let admin = await adminModel.findOne({ email: req.body.email })
    // בודק שהמשתמש בכלל קיים במערכת
    if (admin) {
      // בודק אם הסיסמא של המתמש מתאימה להצפנה שהמשתמש הכניס
      let validPass = await bcrypt.compare(req.body.password, admin.password)
      
      // אם הסיסמא שגויה
      if (!validPass) return res.status(400).json({ message: "Problem login" })
    }
    else {
      // במידה והמשתמש לא קיים
      return res.status(400).json({ message: "Problem login user 20" })
    }
    // מייצר טוקן שישמש לבדיקות שהמשתמש מחובר
    // ניתן גם להגדיר בטוקן תוקף , נניח לשעה הקרובה
    let newToken = getAdminToken({ _id: admin._id, email: admin.email });
    res.json({ token: newToken })
  })
  
  router.post("/del",(req,res) => {
    let delId = req.body.del
    
    /// מחפש את מי למחוק לפי איי די שנשלח לו
    adminModel.deleteOne({_id:delId})
    .then(data => {
      if(data.deletedCount > 0 ){
        res.json({message:"deleted"});
      }
      else{
        res.status(400).json({error:"error id not found"});
      }
    })
  })

    // נשתמש לבדיקה ראשונית בצד לקוח
// אם למשתמש יש בכלל טוקן
router.get("/checkToken",auth,(req,res) => {
  res.json({message:"ok" , status:"login"})
})


router.get("/profile/:id" ,(req,res) => {

  adminModel.findOne({_id:req.params.id})
  .then(data => {
    res.json(data)  
  })
  .catch(err => {
    res.status(400).json(err)
  })
});


// עדכון פרטים של מנהל
router.post("/update", auth ,async (req, res) => {
 
    try {
      // באפדייט צריך למצוא איי די קודם , חוץ מזה די דומה להוספה
      let updateData = await adminModel.updateOne({ _id: req.userData._id }, {$set: req.body});      
      res.json(updateData)

    }
    catch {
      res.status(400).json({ message: "error cant find id" })
    }
  
})

module.exports = router;
