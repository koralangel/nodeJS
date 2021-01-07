const express = require('express');
const router = express.Router();
const { adModel, validateAd } = require("../models/ad_model");
const _ = require("lodash");
const auth = require("../middleware/auth");
const jwt = require("jsonwebtoken");
const config = require("config");



//בדיקה בלבד אחרי זה למחוק מהפרויקט
router.get('/', (req, res, next) => {
  // לבדוק את הפקודה
  //res.header("Content-Type", "text/event-stream");
  adModel.find({})
    .then(data => {
      res.json(data)
    })
    .catch(err => {
      // חשוב לשלוח סטטוס 400 כדי שבצד לקוח הוא יתפוס אותו בקצ' של הפיטץ'
      res.status(400).json(err)
    })

});


// הוספת מודעה חדשה
router.post("/add", auth, async (req, res) => {

  // בדיקה שבכלל המידע שנשלח בפוסט תקין לפי הג'וי
  let validAd = await validateAd(req.body);
  let userObj = {
    first_name: req.userData.first_name,
    date_of_birth: req. userData.date_of_birth,
    city: req.userData.city,
    gender: req.userData.gender,
    _id: req.userData._id,
    image: req.userData.image,
    email: req.userData.email    // חדש
  }


  if (validAd.error) {
    return res.status(400).json(validAd.error.details[0]);
  }

  try {
    let saveData = await adModel.insertMany([Object.assign(req.body, { id_post: req.userData.id, user: userObj })]);
    res.json(_.pick(saveData[0], ["_id", "comment"]));
  }
  catch {
    res.status(400).json({ message: "error insert new ad" })
  }
});


// מחזיר מספר מודעות לפי הגבלה לעמוד על פי ההגבלה שניתנת 
router.get('/limit/:pageNum', (req, res) => {
  //let perPage = Number(req.query.perPage);
  let perPage = 1;
  // limit -> כמה מקסימום להציג
  // SKIP -> על כמה לדלג , ואז אני משתמש בפרמטר של מספר העמוד כפול כמה להציג (לימיט)
  adModel.find({})
    .limit(perPage)
    .skip(req.params.pageNum * perPage)
    //.sort({_id:-1})
    .then(data => {
      res.json(data)
    })
});



// מחזיר מודעה אחת לפי איי די
router.get("/single", auth, (req, res) => {
  let adPostId = req.userData.id;
  console.log(req.userData);
  adModel.findOne({ id_post: adPostId })
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.status(400).json(err)
    })
})


// עדכון פרטים של מודעה
router.post("/update", auth, async (req, res) => {
  let id = req.body.id;
  let dataBody = req.body;
  delete dataBody.id;

  let ad = await validateAd(dataBody);
  console.log(ad);

  if (ad.error) {
    res.status(400).json(ad.error.details[0])
  }
  else {
    try {
      // באפדייט צריך למצוא איי די קודם , חוץ מזה די דומה להוספה
      let adData = await adModel.updateOne({ _id: id }, dataBody);
      res.json(adData)

    }
    catch {
      res.status(400).json({ message: "error cant find id" })
    }
  }
})

//מחיקת מודעה
router.post("/del", (req, res) => {
  let delId = req.body.del

  /// מחפש את מי למחוק לפי איי די שנשלח לו
  adModel.deleteOne({ _id: delId })
    .then(data => {
      if (data.deletedCount > 0) {
        res.json({ message: "deleted" });
      }
      else {
        res.status(400).json({ error: "error id not found" });
      }
    })
})


// מחיקת מודעה של משתמש אחרי שבחר למחוק את הפרופיל
router.post("/deluserad",auth, (req, res) => {

  /// מחפש את מי למחוק לפי איי די שנשלח לו
  adModel.deleteMany({ id_post: req.userData.id })
    .then(data => {
      if (data.deletedCount > 0) {
        res.json({ message: "deleted" });
      }
      else {
        res.status(400).json({ error: "error id not found" });
      }
    })
})


// מחיקת מודעה של משתמש אחרי שבחר למחוק את הפרופיל
router.post("/delexpired",auth, (req, res) => {
  console.log(req.body)

  /// מחפש את מי למחוק לפי איי די שנשלח לו
  adModel.deleteMany({ from_date_f: req.body.date })
    .then(data => {
      if (data.deletedCount > 0) {
        res.json({ message: "deleted" });
      }
      else {
        res.status(400).json({ error: "error id not found" });
      }
    })
})



module.exports = router;