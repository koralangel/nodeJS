const express = require('express');
const router = express.Router();
const _ = require("lodash");
const { blockedModel, validateBlocked } = require('../models/blocked_model');


router.get('/', (req, res, next) => {
  blockedModel.find({})
    .then(data => {
      res.json(data)
    })
    .catch(err => {
      // חשוב לשלוח סטטוס 400 כדי שבצד לקוח הוא יתפוס אותו בקצ' של הפיטץ'
      res.status(400).json(err)
    })

});

router.post("/add/users", async (req, res) => {

  try {
    let saveData = await blockedModel.insertMany([req.body]); 
    console.log(saveData);
    
    res.json(_.pick(saveData[0], ["_id", "email",
    "password",
    "first_name",
    "phone",
    "gender",
    "image",
    "pets",
    "country",
    "city",
    "date_of_birth",
    "about_me",
    "height" ,
    "speaks",
    "smoking",
    "drinking",
    "marijuana",
    "children",
    "body_type",
    "education",
    "relationship",
   "relationship_type",
    "orientation",
    "my_traits",
    "hobbies",
    "categories",
    "finish_registration",
    "my_ideal_person",
    "matching_ads", 
    "registration_date"]))
  }
  catch {
    res.status(400).json({ message: "error insert new user" })
  }
})

router.post("/add/admins", async (req, res) => {

  try {
    let saveData = await blockedModel.insertMany([req.body]); 
    res.json(_.pick(saveData[0], ["_id", "email",
    "password",
    "first_name",
    "phone",
    "gender",
    "image",
    "country",
    "city",
    "date_of_birth",
    "owner",
    "registration_date"]))
  }
  catch {
    res.status(400).json({ message: "error insert new user" })
  }
})

router.get("/profile/:id" ,(req,res) => {

  blockedModel.findOne({_id:req.params.id})
  .then(data => {
    res.json(data)  
  })
  })

  // מחיקת משתמש 
router.post("/del", (req, res) => {
  let delId = req.body.del

  /// מחפש את מי למחוק לפי איי די שנשלח לו
  blockedModel.deleteOne({ _id: delId })
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

