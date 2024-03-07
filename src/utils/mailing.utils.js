import nodemailer from 'nodemailer'
import * as dotenv from 'dotenv'
dotenv.config()

export const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth:{
      user: 'memo.rfl97@gmail.com',
      pass: process.env.GMAIL_APP_PASSWORD
    }
})
