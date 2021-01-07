const express = require('express');
const router = express.Router();
const { citiesModel } = require("../models/cities_model");


//בדיקה בלבד אחרי זה למחוק מהפרויקט
router.get('/', (req, res, next) => {
    // לבדוק את הפקודה
    //res.header("Content-Type", "text/event-stream");
    citiesModel.find({})
      .then(data => {
        res.json(data)
      })
      .catch(err => {
        // חשוב לשלוח סטטוס 400 כדי שבצד לקוח הוא יתפוס אותו בקצ' של הפיטץ'
        res.status(400).json(err)
      })
  
  });

  router.get('/:index',(req,res) => {
    let ind = req.params.index;
    citiesModel.find({})
    .then(data => {
      res.json(data[ind])
    })
  })

  module.exports = router;