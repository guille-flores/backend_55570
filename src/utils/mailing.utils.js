import nodemailer from 'nodemailer'
import { GMAIL_APP_PASSWORD } from '../config.js'

export const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth:{
      user: 'memo.rfl97@gmail.com',
      pass: GMAIL_APP_PASSWORD
    }
})
