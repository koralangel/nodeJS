const mongoose = require("mongoose");


const countersSchema = new mongoose.Schema({
    adNumber: Number
})

/// מייצא מודל שמחבר בין הקולקשן לסכמה שלו
exports.adNumberModel = mongoose.model("counters", countersSchema);