import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

export const sendEmail = async (
  code: string,
  email: string
): Promise<SMTPTransport.SentMessageInfo> => {
    
  //create mail transport
  let transporter = nodemailer.createTransport({
    service: "gmail",
    secure: false,
    port: 465,
    host: "smtp.gmail.com",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  let mailOptions = {
    from: process.env.MAIL_USER,
    to: email,
    subject: "Verification code",
    text: "Your verification code is " + code,
  };

  //send mail with verification code
  return transporter.sendMail(mailOptions);
};
