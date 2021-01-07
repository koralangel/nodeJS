const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://koralangel:jmatch1993@cluster0.orsmi.mongodb.net/db?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});
// mongoose.connect('mongodb://localhost:27017/users', {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
 console.log("connected")
});

module.exports = db;