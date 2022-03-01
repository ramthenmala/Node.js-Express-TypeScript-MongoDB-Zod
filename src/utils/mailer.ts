// SMTPS : Simple Message Transfer Protocol
import nodemailer from 'nodemailer';

async function createTestCred() {
  const creds = await nodemailer.createTestAccount();
  console.log({ creds });
}

createTestCred();

async function sendEmail() {}

export default sendEmail;
