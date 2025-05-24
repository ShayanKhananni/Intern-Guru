import {v2 as cloudinary} from "cloudinary";
import streamifier from "streamifier";
import nodemailer from 'nodemailer';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import ejs from 'ejs'
import path from 'path'
import puppeteer from "puppeteer";

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);





dotenv.config()

export const customError = (statusCode,message) =>
{
  const error = new Error();
  error.message = message;
  error.statusCode = statusCode;
  return error
}

export const successResponseBuilder = (message,result) =>
{
  return {
    message,
    result: result,
    success:true 
  }
}

export const imageUploder = (req) =>
  {
    return new Promise((resolve,reject)=>
    {
      const uploadStream = cloudinary.uploader.upload_stream(
        { public_id: req.file.originalname,
          folder: "Profile-Pics"
         },
        (error, result) => {
  
          if (!result) {
            reject(error);
          }
          resolve(result.secure_url);
        }
      );
      streamifier.createReadStream(req.file.buffer).pipe(uploadStream)
    })
}

export const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'internguruu@gmail.com', 
        pass: process.env.APP_PASSWORD,
      },
    });

    // Convert plain text into a basic HTML structure
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
        <h2 style="color: #007BFF;">${subject}</h2>
        <p style="font-size: 16px; color: #333;">${text}</p>
        <br />
        <p style="font-size: 14px; color: #888;">This message was sent by Intern Guruu.</p>
      </div>
    `;

    const info = await transporter.sendMail({
      from: '"Intern Guruu" <internguruu@gmail.com>',
      to,
      subject,
      text,  
      html,  
    });

    console.log('Email sent to ', to, 'successfully!!', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
 
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);





// Helper function to generate PDF buffer from EJS template
export const resumeBuilder = async (resumeData) => {
  // Render HTML from EJS template file
  const html = await ejs.renderFile(
    path.join(__dirname, '../templates/resume.ejs'),
    { data: resumeData }
  );

  // Launch Puppeteer browser
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'], // for some Linux environments
  });

  const page = await browser.newPage();

  // Set rendered HTML content
  await page.setContent(html, { waitUntil: 'networkidle0' });

  // Generate PDF buffer from page
  const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });

  await browser.close();

  return pdfBuffer;
};



