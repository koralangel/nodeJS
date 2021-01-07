const express = require('express');
const { faultModel, validateFault } = require('../models/faults_model');
const router = express.Router();
const _ = require("lodash");



//בדיקה בלבד אחרי זה למחוק מהפרויקט
router.get('/', (req, res, next) => {
    faultModel.find({})
        .then(data => {
            res.json(data)
        })
        .catch(err => {
            // חשוב לשלוח סטטוס 400 כדי שבצד לקוח הוא יתפוס אותו בקצ' של הפיטץ'
            res.status(400).json(err)
        })

});

// הוספת תקלה חדשה
router.post('/add', async (req, res) => {
    // בודק שנשלחו כל הפריטים בצורה נכונה לפי המודל גו'י שביקשנו
    let validFault = validateFault(req.body)

    if (validFault.error) {
        return res.status(400).json(validFault.error.details[0]);
    }

    try {
        let saveData = await faultModel.insertMany([req.body]);       
        res.json(_.pick(saveData[0], ["_id","email","admin_name"]));
    }
    catch {
        res.status(400).json({ message: "errorr" })
    }
})





module.exports = router;
