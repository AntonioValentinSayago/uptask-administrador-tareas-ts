// Looking to send emails in production? Check out our Email API/SMTP product!
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config()

const config = () => {
    return {
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "2436e09803c9b7",
        pass: "87e3c849ab492b"
      }
    }
}

export const transporter = nodemailer.createTransport(config());