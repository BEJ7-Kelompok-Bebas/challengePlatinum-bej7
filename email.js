const nodemailer = require("nodemailer");
env =require('dotenv')
env.config();

// config transporter
const transporter = nodemailer.createTransport({
  service: 'outlook', // no need to set host or port etc.
  auth: {
      user: process.env.EMAIL2,
      pass: process.env.PASS2,
  },
  tls: {
          rejectUnauthorized: false,
        }
});

// config option
const option = {
        from: process.env.EMAIL2 ,
        to: [process.env.EMAIL2] ,
        subject: 'Testing Email' ,
        text: "Hello World" ,
    }

// send email
transporter.sendMail( option, function (err, info){
        if (err){
            console.log('error' , err)
        }
        else{
        console.log('result:' , info.response)
        }
    })




