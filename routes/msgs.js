const express = require('express');
const router = express.Router();
const { msgModel, validateMsg } = require("../models/msg_model");
const auth = require("../middleware/auth");
const { TooManyRequests } = require('http-errors');




//בדיקה בלבד אחרי זה למחוק מהפרויקט
router.get('/', (req, res, next) => {
  msgModel.find({})
    .then(data => {
      res.json(data)
    })
    .catch(err => {
      // חשוב לשלוח סטטוס 400 כדי שבצד לקוח הוא יתפוס אותו בקצ' של הפיטץ'
      res.status(400).json(err)
    })

});



// הוספת הודעה חדשה
router.post("/add", async (req, res) => {
  // בדיקה שבכלל המידע שנשלח בפוסט תקין לפי הג'וי
  let validMsg = await validateMsg(req.body);
  if (validMsg.error) {
    return res.status(400).json(validMsg.error.details[0]);
  }

  try {
    let saveData = await msgModel.insertMany([req.body]);
    res.json(saveData);
  }
  catch {
    res.status(400).json({ message: "error insert new massage" })
  }
})



router.get("/single/:id", (req, res) => {

  msgModel.findOne({ _id: req.params.id })
    .then(data => {
      res.json(data)
    })
})


// עדכון מערך הודעות 
router.post("/update", auth, async (req, res) => {
  let idBox = req.body.boxId;
  console.log(req.body);
  let msg_arr = {
    messages: req.body.messages,
    lastTimeChat: req.body.lastTimeChat
  }
  try {
    // באפדייט צריך למצוא איי די קודם , חוץ מזה די דומה להוספה
    let updateData = await msgModel.updateOne({ _id: idBox }, msg_arr);
    console.log(updateData);
    res.json(updateData)

  }
  catch {
    res.status(400).json({ message: "error cant find id" })
  }

})


// עדכון מערך הודעות של אדמיין
router.post("/updateAdminMsg", auth, async (req, res) => {

  let msgObj = {
    userPost: "1",
    time: req.body.time,
    msg: req.body.newMsg
  }
  try {
    let updateData = await msgModel.updateMany({ admin_status: true }, { $push: { messages: { "userPost": "1", "time": req.body.time, "msg": req.body.newMsg } }, "lastTimeChat": req.body.lastTimeChat })
    res.json(updateData)
  }
  catch {
    res.status(400).json({ message: "error cant find id" })
  }
});


// מחיקת מודעה של משתמש אחרי שבחר למחוק את הפרופיל
router.post("/deluserad", auth, (req, res) => {
  /// מחפש את מי למחוק לפי איי די שנשלח לו
  msgModel.deleteMany({ userAId: req.userData.id})
    .then(data => {
      console.log(data)
      if (data.deletedCount > 0) {
        res.json({ message: "deleted" });
      }
      else {
        res.status(400).json({ error: "error id not found" });
      }
    })
});

// מחיקת מודעה של משתמש אחרי שבחר למחוק את הפרופיל
router.post("/deluseradb", auth, (req, res) => {
  /// מחפש את מי למחוק לפי איי די שנשלח לו
  msgModel.deleteMany({ userBId: req.userData.id})
    .then(data => {
      console.log(data)
      if (data.deletedCount > 0) {
        res.json({ message: "deleted" });
      }
      else {
        res.status(400).json({ error: "error id not found" });
      }
    })
});




module.exports = router;