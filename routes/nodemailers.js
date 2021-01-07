let express = require('express');
let nodemailer = require('nodemailer');
const router = express.Router();




router.post('/access', (req, res, next) => {

  let email = req.body.email;
  let message = req.body.message;
  let title = req.body.title;


  let mailOptions = {
    from: email,
    to: "koralangel93@gmail.com",
    subject: ` <${email}> Subject: ${title}`,
    html: `
    <p>You have a new mail request</p>
    <h3>Contact Details</h3>
    <div>  
      <p><b>Email:</b> ${email}</p>
    </div>
    <h3>Subject</h3>
    <p>${title}</p>
    <h3>Message</h3>
    <p>${message}</p>
  `
  }

  let transporter = nodemailer.createTransport({
    host: 'mail.koralangel93.com',
    port: 587,
    secure: false,
    service: 'Gmail',
    auth: {
      user: 'koralangel93',
      pass: '15koral25angel'
    },
    tls: {
      // do not fail on invalid certs
      rejectUnauthorized: false
    }
  })


  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      res.json({
        status: 'fail'
      })
    } else {
      res.json({
        status: 'success'
      })
    }
  })
})

router.post('/forgotAccess', (req, res, next) => {

  let email = req.body.email;
  let password = req.body.password1;
  let localhost = req.body.localhost;
  let link = localhost + '/login';

  let mailOptions = {
    from: "koralangel93@gmail.com",
    to: email,
    subject: ` <${email}> Subject: New Password`,
    html: `
    <p>You have a new mail request</p>
    <h3>Contact Details</h3>
    <div>  
      <p><b>Email:</b> ${email}</p>
    </div>
    <h3>Message</h3>
    <p><b>New Password</b> ${password}</p>
    <a href=${link}>Jmatch Login</a>
  `
  }

  let transporter = nodemailer.createTransport({
    host: 'mail.koralangel93.com',
    port: 587,
    secure: false,
    service: 'Gmail',
    auth: {
      user: 'koralangel93',
      pass: '15koral25angel'
    },
    tls: {
      // do not fail on invalid certs
      rejectUnauthorized: false
    }
  })


  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      res.json({
        status: 'fail'
      })
    } else {
      res.json({
        status: 'success'
      })
    }
  })
})

router.post('/loginAccess', (req, res, next) => {

  let email = req.body.email;
  let localhost = req.body.localhost;
  let mailOptions = {
    from: "koralangel93@gmail.com",
    to: email,
    subject: ` <${email}> Subject: Welcome to Jmatch`,
    html: `
    <h3>Welcome to Jmatch</h3>
    <div>  
    <p><b>Contact Details</b></p>
      <p><b>Email:</b> ${email}</p>
    </div>
    <h3>Message</h3>
    <a href=${localhost}>Jmatch Site</a>
  `
  }

  let transporter = nodemailer.createTransport({
    host: 'mail.koralangel93.com',
    port: 587,
    secure: false,
    service: 'Gmail',
    auth: {
      user: 'koralangel93',
      pass: '15koral25angel'
    },
    tls: {
      // do not fail on invalid certs
      rejectUnauthorized: false
    }
  })


  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      res.json({
        status: 'fail'
      })
    } else {
      res.json({
        status: 'success'
      })
    }
  })
})

module.exports = router;