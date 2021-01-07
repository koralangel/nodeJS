const express = require('express');
const router = express.Router();
const { userModel, validateUser, getUserToken } = require("../models/user_model")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const _ = require("lodash");
const config = require("config");



const { adModel } = require("../models/ad_model");
const { blockedModel } = require('../models/blocked_model')






//בדיקה בלבד אחרי זה למחוק מהפרויקט
router.get('/', (req, res, next) => {
  userModel.find({})
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
  let validUser = await validateUser(req.body);
  if (validUser.error) {
    return res.status(400).json(validUser.error.details[0]);
  }
  let blockUser = await blockedModel.findOne({ email: req.body.email })
  // רמת הצפנה בשביל הביקריפט 10 זה ממוצע ומספיק טוב לאבטחה
  const salt = await bcrypt.genSalt(10);
  // כדי שהסיסמא תהיה מוצפנת
  req.body.password = await bcrypt.hash(req.body.password, salt);

  try {
    // כדי למשוך ליוזר את המודעות המתאימות לפי קטגוריות
    //let ad_data = await adModel.find({})
    //console.log(ad_data);
    if (blockUser === null) {
      let saveData = await userModel.insertMany([req.body]);
      res.json(_.pick(saveData[0], ["_id", "email"]));

    }
    else {
      throw res.status(400).json({ massage: "error insert new user" })
    }

  }
  catch {
    res.status(400).json({ message: "error insert new user" })
  }
})


// עדכון פרטים של משתמש
router.post("/update", auth, async (req, res) => {
  let dataBody = req.body;

  let user = await validateUser(dataBody);

  if (user.error) {
    res.status(400).json(user.error.details[0])
  }
  else {
    try {
      // באפדייט צריך למצוא איי די קודם , חוץ מזה די דומה להוספה
      let updateData = await userModel.updateOne({ _id: req.userData._id }, req.body);
      console.log(updateData);
      res.json(updateData)

    }
    catch {
      res.status(400).json({ message: "error cant find id" })
    }
  }
})


// עידכון פרטים של משתמש שלחצו עליו או על הפוסט שלו לייק
router.post("/updatelike", auth, async (req, res) => {
  let id = req.body.id;
  console.log(req.body);

  try {
    let user = await userModel.findOne({ _id: id });
    console.log(user);
    let temp_who_likes = user.who_likes;
    let tempObjUpdate = {
      _id: req.userData._id,
      first_name: req.userData.first_name,
      image: req.userData.image,
      city: req.userData.city,
      gender: req.userData.gender,
      date_of_birth: req.userData.date_of_birth
    }
    // user.who_likes.push(tempObjUpdate)
    temp_who_likes.push(tempObjUpdate);
    console.log(temp_who_likes);
    let tempObj = {
      who_likes: temp_who_likes
    }
    console.log(tempObj);
    try {
      // באפדייט צריך למצוא איי די קודם , חוץ מזה די דומה להוספה
      let updateData = await userModel.updateOne({ _id: id }, tempObj);
      // let saveData = await adModel.insertMany([Object.assign(req.body, { _id: req.userData.id, user: userObj })]);
      // res.json(_.pick(saveData[0], ["_id", "comment"]));
      // console.log(updateData);
      res.json(updateData)

    }
    catch {
      res.status(400).json({ message: "error cant find id1" })
    }

  }
  catch {
    res.status(400).json({ message: "error cant find id2" })
  }
})


// עדכון פרטים של משתמש
router.post("/updateVip", auth, async (req, res) => {
  try {
    // באפדייט צריך למצוא איי די קודם , חוץ מזה די דומה להוספה
    let updateData = await userModel.updateOne({ _id: req.body._id }, { vip: { vip: req.body.vip } });
    res.json(updateData)
    console.log(updateData);

  }
  catch {
    res.status(400).json({ message: "error cant find id" })
  }

})






router.get("/single", auth, async (req, res) => {
  let userId = req.userData.id;
  userModel.findOne({ _id: userId })
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.status(400).json(err)
    })
})


// התחברות
router.post("/login", async (req, res) => {
  // משווה את המתשנה יוזר למידע של חיפוש משתמש
  //SELECT * FROM users where email = req.body.email
  let user = await userModel.findOne({ email: req.body.email })
  // בודק שהמשתמש בכלל קיים במערכת
  if (user) {
    // בודק אם הסיסמא של המתמש מתאימה להצפנה שהמשתמש הכניס
    let validPass = await bcrypt.compare(req.body.password, user.password)

    // אם הסיסמא שגויה
    if (!validPass) return res.status(400).json({ message: "Problem login" })
  }
  else {
    // במידה והמשתמש לא קיים
    return res.status(400).json({ message: "Problem login user 20" })
  }
  // מייצר טוקן שישמש לבדיקות שהמשתמש מחובר
  // ניתן גם להגדיר בטוקן תוקף , נניח לשעה הקרובה
  let newToken = getUserToken({ _id: user._id, email: user.email });
  res.json({ token: newToken })
})


// מחיקת משתמש 
router.post("/del", (req, res) => {
  let delId = req.body.del

  /// מחפש את מי למחוק לפי איי די שנשלח לו
  userModel.deleteOne({ _id: delId })
    .then(data => {
      if (data.deletedCount > 0) {
        res.json({ message: "deleted" });
      }
      else {
        res.status(400).json({ error: "error id not found" });
      }
    })
})


router.get("/profile/:id", (req, res) => {

  userModel.findOne({ _id: req.params.id })
    .then(data => {
      res.json(data)
    })
})


// חדששששש
// עדכון פרטים של משתמש על פי איי די שנשלח באובייקט
router.post("/updateanother", auth, async (req, res) => {
  let id = req.body.id;
  let dataBody = req.body;
  delete dataBody.id;
  
  try {
    // באפדייט צריך למצוא איי די קודם , חוץ מזה די דומה להוספה
    let updateData = await userModel.updateOne({ _id: id }, dataBody);
    res.json(updateData)
  }
  catch {
    res.status(400).json({ message: "error cant find id" })
  }

});



// מחיקת משתמש אחרי שבחר למחוק את הפרופיל
router.post("/deluser",auth, (req, res) => {

  /// מחפש את מי למחוק לפי איי די שנשלח לו
  userModel.deleteOne({ _id: req.userData.id })
    .then(data => {
      if (data.deletedCount > 0) {
        res.json({ message: "deleted" });
      }
      else {
        res.status(400).json({ error: "error id not found" });
      }
    })
})



// עדכון פרטים של משתמש
router.post("/updateBlock", auth, async (req, res) => {
  try {
    // באפדייט צריך למצוא איי די קודם , חוץ מזה די דומה להוספה
    let updateData = await userModel.updateOne({ _id: req.body._id }, { block_status: req.body.block_status });
    res.json(updateData)
    console.log(updateData);

  }
  catch {
    res.status(400).json({ message: "error cant find id" })
  }

})


// עדכון פרטים של משתמש
router.post("/updatePassword",  async (req, res) => {
  console.log(req.body);
  

  // רמת הצפנה בשביל הביקריפט 10 זה ממוצע ומספיק טוב לאבטחה
  const salt = await bcrypt.genSalt(10);
  // כדי שהסיסמא תהיה מוצפנת
  req.body.password = await bcrypt.hash(req.body.password, salt);

  if(req.body.user === "user"){
    try {
      // באפדייט צריך למצוא איי די קודם , חוץ מזה די דומה להוספה
      let updateData = await userModel.updateOne({ _id: req.body._id },{password: req.body.password});
      console.log(updateData);
      res.json(updateData)

    }
    catch {
      res.status(400).json({ message: "error cant find id" })
    }
  }
  else{
    try {
      // באפדייט צריך למצוא איי די קודם , חוץ מזה די דומה להוספה
      let updateData = await adminModel.updateOne({ _id: req.body._id },{password: req.body.password});
      console.log(updateData);
      res.json(updateData)

    }
    catch {
      res.status(400).json({ message: "error cant find id" })
    }
  }
  
})









module.exports = router;
