// SMTPS : Simple Message Transfer Protocol
import nodemailer, { SendMailOptions } from 'nodemailer';
import config from 'config';
import log from './logger';

// async function createTestCred() {
//   const creds = await nodemailer.createTestAccount();
//   console.log({ creds });
// }

// createTestCred();

const smtp = config.get<{
  user: string;
  pass: string;
  host: string;
  port: number;
  secure: boolean;
}>('smtp');

const transporter = nodemailer.createTransport({
  ...smtp,
  auth: { user: smtp.user, pass: smtp.pass },
});

async function sendEmail(payload: SendMailOptions) {
  transporter.sendMail(payload, (err, info) => {
    if (err) {
      log.error(err, 'Error Sending Email');
      return;
    }
    log.info(`Preview Url: ${nodemailer.getTestMessageUrl(info)}`);
  });
}

export default sendEmail;
