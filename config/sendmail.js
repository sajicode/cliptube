const nodemailer = require('nodemailer');

function sendMail(address, message) {
  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  let mailOptions = {
    from: '"CodeBreaker" <DevAdams>',
    to: address,
    subject: 'New User Register',
    html: message
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      return console.log(error);
    } else {
      console.log(`Email sent ${info.response}`);
    }
  });
}

module.exports = {
  sendMail
};