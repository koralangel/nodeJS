const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const fileUpload = require('express-fileupload');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const mongoR = require('./mongoDB/mongo_connection');
const adminR = require('./routes/admins');
const uploadR = require('./routes/upload');
const adsR = require('./routes/ads');
const blockedR = require('./routes/blockeds');
const reportR = require('./routes/reports');
const citiesR = require('./routes/cities');
const MessageR = require('./routes/messages');
const msgR = require('./routes/msgs');
const faultR = require('./routes/faults');
const nodeMailerR = require('./routes/nodemailers');






// io socket
const http = require("http");
const socketio = require("socket.io");
const { messageModel } = require('./models/message_model');
const { msgModel } = require('./models/msg_model');

const port = process.env.port || 4002;


const app = express();


app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));


//io socket
const server = http.createServer(app);
const io = socketio(server);

server.listen(port, () => console.log(`Listening on port ${port}`));


app.all('*', function (req, res, next) {
  if (!req.get('Origin')) return next();
  // במציאות במקום כוכבית נכניס את הדומיינים האמיתיים שהצד לקוח נמצא בהם
  // כדי שלא כל אחד יוכל לבצע בקשות לשרת שלנו
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,x-auth-token');
  next();
});




// give the server upload file up to 2 mb
app.use(fileUpload({
  limits: { fileSize: 2 * 1024 * 1024 }
}));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admins', adminR);
app.use('/upload', uploadR);
app.use('/ads', adsR);
app.use('/blockeds', blockedR);
app.use('/reports', reportR);
app.use('/cities', citiesR);
app.use('/messages', MessageR);
app.use('/faults', faultR);
app.use('/msgs', msgR);
app.use('/sendmails', nodeMailerR);



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


//socket io

//let interval;
io.on("connection", (socket) => {
  console.log("conntect");

  // יצירת תיבת צ'אט חדשה
  socket.on("Set new msg", data => {
    // try {
    //   // ההודעה נכנסת לקולקשן "הודעות"
    let msg_arr = {}
    // console.log(data);
    msg_arr['messages'] = data.updateObj.messages;
    // הבקשה נשלחת חזרה לצד לקוח
    io.emit("out put", {
      messages: data.updateObj.messages[data.updateObj.messages.length - 1],
      boxId: data.updateObj.boxId,
      userGet: data.updateObj.userGet,
      userPost: data.updateObj.userPost
    })
  });

  // התראות על הודעה חדשה
  socket.on("alert", data => {
    console.log(data);
    io.emit("back alert", {
      userGet: data.userGetAlert,
      boxId: data.boxIdState
    })
  });

    // כאשר אדמיין שולח הודעה כללית לכולם
    socket.on("Admin send msg", data => {
      console.log(data)
  
      // הבקשה נשלחת חזרה לצד לקוח
      io.emit("out put admin msg", {
        time: data.singleMsgObj.time,
        newMsg: data.singleMsgObj.newMsg,
        userPost: data.singleMsgObj.userPost     
      })
    });


});


// התראות על הודעה חדשה
// socket.on("alert", data => {
//   console.log(data);
//   return (io.emit("back alert", {
//     data
//   }))

// });

module.exports = app;
