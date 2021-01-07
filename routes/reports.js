const express = require('express');
const router = express.Router();
const { reportModel, validateReport } = require("../models/report_model");

const auth = require("../middleware/auth");  // חדש




//בדיקה בלבד אחרי זה למחוק מהפרויקט
router.get('/', (req, res, next) => {
  reportModel.find({})
    .then(data => {
      res.json(data)
    })
    .catch(err => {
      // חשוב לשלוח סטטוס 400 כדי שבצד לקוח הוא יתפוס אותו בקצ' של הפיטץ'
      res.status(400).json(err)
    })

});


//מחיקת report
router.post("/del", (req, res) => {
  let delId = req.body.del

  /// מחפש את מי למחוק לפי איי די שנשלח לו
  reportModel.deleteOne({ _id: delId })
    .then(data => {
      if (data.deletedCount > 0) {
        res.json({ message: "deleted" });
      }
      else {
        res.status(400).json({ error: "error id not found" });
      }
    })
})


// הוספת דיווח חדש
router.post("/add", auth, async (req, res) => {   // חדש
  let obj = {
    name: req.body.name,
    image: req.body.image,
    title: req.body.title,
    info: req.body.info,
    user_report_id: req.userData._id,
    reported_id: req.body.reported_id
  }
  try {
    let saveData = await reportModel.insertMany([obj]);
    res.json(saveData);
  }
  catch {
    res.status(400).json({ message: "error insert new report" })
  }
});



module.exports = router;