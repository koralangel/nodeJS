const express = require('express');
const router = express.Router();
const { messageModel, validateMessage } = require("../models/message_model");
const auth = require("../middleware/auth");




//בדיקה בלבד אחרי זה למחוק מהפרויקט
router.get('/', (req, res, next) => {
    messageModel.find({})
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
    let validMessage = await validateMessage(req.body);
    if (validMessage.error) {
        return res.status(400).json(validMessage.error.details[0]);
    }

    try {
        let saveData = await messageModel.insertMany([req.body]);
        res.json(saveData);
    }
    catch {
        res.status(400).json({ message: "error insert new massage" })
    }
})




module.exports = router;