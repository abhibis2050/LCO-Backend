const nodemailer = require("nodemailer")

//using MAIL TRAP ...

const mailHelper = async (option) => {
    let transporter = nodemailer.createTransport({
        host:process.env.SMTP_HOST ,
        port: process.env.SMTP_PORT,
        auth: {
          user: process.env.SMTP_USER, // generated ethereal user
          pass: process.env.SMTP_PASS, // generated ethereal password
        },
      });


      const message = {
        from: 'abhisekbiswas2050@gmail.com ', // sender address
        to:option.email ,
        subject: option.subject,
        text: option.message, // plain text body
        
      }
    
      // send mail with defined transport object
        await transporter.sendMail(message); 
}

module.exports = mailHelper