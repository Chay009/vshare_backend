// Name	Phoebe Skiles
// Username	phoebe30@ethereal.email
// Password	yvwWfCKAVDPA59B8jC

const nodemailer = require("nodemailer");

const sendMail = async (email,html,options) => {
  

/*

create a new gmail account

then manage account then 2 step verification 
once verified using mobile number 

then again click on 2 step verification go to app passowrds add project name then copy it

*/

const transporter = nodemailer.createTransport({
  service:"gmail",
  
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.APP_PASSWORD
  }
});
console.log(options.from)

  let info = await transporter.sendMail({

    from: `${options.from} <${process.env.SENDER_EMAIL}>`,
     // sender address
    to: email, // list of receivers
    subject: options.subject, // Subject line
  
    html: html, // html body
  });

  console.log("Message sent: %s", info.messageId);

};

module.exports = {sendMail};