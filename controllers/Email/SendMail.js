const nodemailer = require("nodemailer");
const RandomString = require("randomstring");
const UserEmail = require("../../models/UserEmailSchema");
const moment = require("moment-timezone");
const path = require("path");
const dotenv = require("dotenv");
const fs = require("fs");
const { dogzip, CreatePath } = require("../APILogManager");
dotenv.config({ path: "./config/config.env" });

// async..await is not allowed in global scope, must use a wrapper
const ActivationEmail = async (Email, id) => {
  const ActivationKey = RandomString.generate({
    length: 12,
  });

  try {
    let transporter = nodemailer.createTransport({
      host: process.env.SMTP_SERVER,
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USERNAME, // generated ethereal user
        pass: process.env.SMTP_PASSWORD, // generated ethereal password
      },
    });

    let info = await transporter.sendMail({
      from: `"RajeTech API Admin" <${process.env.SMTP_USERNAME}>`, // sender address
      to: Email, // list of receivers
      cc: process.env.SMTP_USERNAME,
      subject: "Raje Tech REST API Activation Link", // Subject line
      //html: `<br>Activation Link<br> <br> Activation Link - https://api.raje.tech/api/v2/activation/${ActivationKey}`, // plain text body
      html: `<!DOCTYPE html>
      <html>
      <head>
      
        <meta charset="utf-8">
        <meta http-equiv="x-ua-compatible" content="ie=edge">
        <title>Email Confirmation</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style type="text/css">
        /**
         * Google webfonts. Recommended to include the .woff version for cross-client compatibility.
         */
        @media screen {
          @font-face {
            font-family: 'Source Sans Pro';
            font-style: normal;
            font-weight: 400;
            src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');
          }
      
          @font-face {
            font-family: 'Source Sans Pro';
            font-style: normal;
            font-weight: 700;
            src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');
          }
        }
      
        /**
         * Avoid browser level font resizing.
         * 1. Windows Mobile
         * 2. iOS / OSX
         */
        body,
        table,
        td,
        a {
          -ms-text-size-adjust: 100%; /* 1 */
          -webkit-text-size-adjust: 100%; /* 2 */
        }
      
        /**
         * Remove extra space added to tables and cells in Outlook.
         */
        table,
        td {
          mso-table-rspace: 0pt;
          mso-table-lspace: 0pt;
        }
      
        /**
         * Better fluid images in Internet Explorer.
         */
        img {
          -ms-interpolation-mode: bicubic;
        }
      
        /**
         * Remove blue links for iOS devices.
         */
        a[x-apple-data-detectors] {
          font-family: inherit !important;
          font-size: inherit !important;
          font-weight: inherit !important;
          line-height: inherit !important;
          color: inherit !important;
          text-decoration: none !important;
        }
      
        /**
         * Fix centering issues in Android 4.4.
         */
        div[style*="margin: 16px 0;"] {
          margin: 0 !important;
        }
      
        body {
          width: 100% !important;
          height: 100% !important;
          padding: 0 !important;
          margin: 0 !important;
        }
      
        /**
         * Collapse table borders to avoid space between cells.
         */
        table {
          border-collapse: collapse !important;
        }
      
        a {
          color: #1a82e2;
        }
      
        img {
          height: auto;
          line-height: 100%;
          text-decoration: none;
          border: 0;
          outline: none;
        }
        </style>
      
      </head>
      <body style="background-color: #e9ecef;">
      
        <!-- start preheader -->
        <div class="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;">
          A preheader is the short summary text that follows the subject line when an email is viewed in the inbox.
        </div>
        <!-- end preheader -->
      
        <!-- start body -->
        <table border="0" cellpadding="0" cellspacing="0" width="100%">
      
          <!-- start logo -->
          <tr>
            <td align="center" bgcolor="#e9ecef">
              <!--[if (gte mso 9)|(IE)]>
              <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
              <tr>
              <td align="center" valign="top" width="600">
              <![endif]-->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                <tr>
                  <td align="center" valign="top" style="padding: 36px 24px;">
                    <a href="https://api.raje.tech" target="_blank" style="display: inline-block;">
                      <img src="https://i.ibb.co/h24Qg2L/logo.png" alt="Logo" border="0" width="100" style="display: block; width: 100px; max-width: 100px; min-width: 100px;">
                    </a>
                  </td>
                </tr>
              </table>
              <!--[if (gte mso 9)|(IE)]>
              </td>
              </tr>
              </table>
              <![endif]-->
            </td>
          </tr>
          <!-- end logo -->
      
          <!-- start hero -->
          <tr>
            <td align="center" bgcolor="#e9ecef">
              <!--[if (gte mso 9)|(IE)]>
              <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
              <tr>
              <td align="center" valign="top" width="600">
              <![endif]-->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                <tr>
                  <td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;">
                    <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">Confirm Your Email Address</h1>
                  </td>
                </tr>
              </table>
              <!--[if (gte mso 9)|(IE)]>
              </td>
              </tr>
              </table>
              <![endif]-->
            </td>
          </tr>
          <!-- end hero -->
      
          <!-- start copy block -->
          <tr>
            <td align="center" bgcolor="#e9ecef">
              <!--[if (gte mso 9)|(IE)]>
              <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
              <tr>
              <td align="center" valign="top" width="600">
              <![endif]-->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
      
                <!-- start copy -->
                <tr>
                  <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                    <p style="margin: 0;">Tap the button below to confirm your email address. If you didn't create an account with <a href="https://api.raje.tech">Raje Tech API</a>, you can safely delete this email.</p>
                  </td>
                </tr>
                <!-- end copy -->
      
                <!-- start button -->
                <tr>
                  <td align="left" bgcolor="#ffffff">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td align="center" bgcolor="#ffffff" style="padding: 12px;">
                          <table border="0" cellpadding="0" cellspacing="0">
                            <tr>
                              <td align="center" bgcolor="#1a82e2" style="border-radius: 6px;">
                                <a href="https://api.raje.tech/api/activation?Key=${ActivationKey}&User=${id}" target="_blank" style="display: inline-block; padding: 16px 36px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px;">Activate Account</a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <!-- end button -->
      
                <!-- start copy -->
                <tr>
                  <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                    <p style="margin: 0;">If that doesn't work, copy and paste the following link in your browser:</p>
                    <p style="margin: 0;"><a href="https://api.raje.tech/api/activation?Key=${ActivationKey}&User=${id}" target="_blank">https://api.raje.tech/api/activation?Key=${ActivationKey}&User=${id}</a></p>
                  </td>
                </tr>
                <!-- end copy -->
      
                <!-- start copy -->
                <tr>
                  <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; border-bottom: 3px solid #d4dadf">
                    <p style="margin: 0;">Cheers,<br> BY.RAJE</p>
                  </td>
                </tr>
                <!-- end copy -->
      
              </table>
              <!--[if (gte mso 9)|(IE)]>
              </td>
              </tr>
              </table>
              <![endif]-->
            </td>
          </tr>
          <!-- end copy block -->
      
          <!-- start footer -->
          <tr>
            <td align="center" bgcolor="#e9ecef" style="padding: 24px;">
              <!--[if (gte mso 9)|(IE)]>
              <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
              <tr>
              <td align="center" valign="top" width="600">
              <![endif]-->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
      
                <!-- start permission -->
                <tr>
                  <td align="center" bgcolor="#e9ecef" style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;">
                    <p style="margin: 0;">You received this email because we received a request for API Account. If you didn't request for API Account , you can safely delete this email.</p>
                  </td>
                </tr>
                <!-- end permission -->
      
              </table>
              <!--[if (gte mso 9)|(IE)]>
              </td>
              </tr>
              </table>
              <![endif]-->
            </td>
          </tr>
          <!-- end footer -->
      
        </table>
        <!-- end body -->
      
      </body>
      </html>`, // html body
    });

    const ActivationMessageId = info.messageId;
    const Response = {
      Email: Email,
      ActivationMessageId: ActivationMessageId,
      UserID: id,
      ActivationKey: ActivationKey,
    };
    await UserEmail.create(Response);
  } catch (error) {
    console.log(error);
    const Error = {
      Error: error,
      Email: Email,
      UserID: id,
    };
    await UserEmail.create(Error);
  }
};

const WelcomeEmail = async (Email, APIUserInfo, IP) => {
  var date = moment().tz("Asia/Kolkata").format("MMMM Do YYYY, hh:mm:ss A");
  // send mail with defined transport object
  console.log(IP);
  const { AESKey, APIClientID, APISecretKey, APICallLimit, _id } = APIUserInfo;

  try {
    let transporter = nodemailer.createTransport({
      host: process.env.SMTP_SERVER,
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USERNAME, // generated ethereal user
        pass: process.env.SMTP_PASSWORD, // generated ethereal password
      },
    });
    let info = await transporter.sendMail({
      from: `"Raje Tech API Admin" <${process.env.SMTP_USERNAME}>`, // sender address
      to: Email, // list of receivers
      cc: process.env.SMTP_USERNAME,
      subject: "Welcome To RajeTech API", // Subject line
      //html: `<br>Activation Link<br> <br> Activation Link - https://api.raje.tech/api/v2/activation/${ActivationKey}`, // plain text body
      html: `<!DOCTYPE html>
      <html>
      <head>
      
        <meta charset="utf-8">
        <meta http-equiv="x-ua-compatible" content="ie=edge">
        <title>Welcome Email</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style type="text/css">
        /**
         * Google webfonts. Recommended to include the .woff version for cross-client compatibility.
         */
        @media screen {
          @font-face {
            font-family: 'Source Sans Pro';
            font-style: normal;
            font-weight: 400;
            src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');
          }
      
          @font-face {
            font-family: 'Source Sans Pro';
            font-style: normal;
            font-weight: 700;
            src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');
          }
        }
      
        /**
         * Avoid browser level font resizing.
         * 1. Windows Mobile
         * 2. iOS / OSX
         */
        body,
        table,
        td,
        a {
          -ms-text-size-adjust: 100%; /* 1 */
          -webkit-text-size-adjust: 100%; /* 2 */
        }
      
        /**
         * Remove extra space added to tables and cells in Outlook.
         */
        table,
        td {
          mso-table-rspace: 0pt;
          mso-table-lspace: 0pt;
        }
      
        /**
         * Better fluid images in Internet Explorer.
         */
        img {
          -ms-interpolation-mode: bicubic;
        }
      
        /**
         * Remove blue links for iOS devices.
         */
        a[x-apple-data-detectors] {
          font-family: inherit !important;
          font-size: inherit !important;
          font-weight: inherit !important;
          line-height: inherit !important;
          color: inherit !important;
          text-decoration: none !important;
        }
      
        /**
         * Fix centering issues in Android 4.4.
         */
        div[style*="margin: 16px 0;"] {
          margin: 0 !important;
        }
      
        body {
          width: 100% !important;
          height: 100% !important;
          padding: 0 !important;
          margin: 0 !important;
        }
      
        /**
         * Collapse table borders to avoid space between cells.
         */
        table {
          border-collapse: collapse !important;
        }
      
        a {
          color: black;
        }
      
        img {
          height: auto;
          line-height: 100%;
          text-decoration: none;
          border: 0;
          outline: none;
        }
        </style>
      
      </head>
      <body style="background-color: #e9ecef;">
      
        <!-- start preheader -->
        <div class="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;">
          A preheader is the short summary text that follows the subject line when an email is viewed in the inbox.
        </div>
        <!-- end preheader -->
      
        <!-- start body -->
        <table border="0" cellpadding="0" cellspacing="0" width="100%">
      
          <!-- start logo -->
          <tr>
            <td align="center" bgcolor="#e9ecef">
              <!--[if (gte mso 9)|(IE)]>
              <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
              <tr>
              <td align="center" valign="top" width="600">
              <![endif]-->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                <tr>
                  <td align="center" valign="top" style="padding: 36px 24px;">
                    <a href="https://api.raje.tech" target="_blank" rel="noopener noreferrer" style="display: inline-block;">
                      <img src="https://i.ibb.co/h24Qg2L/logo.png" alt="Logo" border="0" width="100" style="display: block; width: 100px; max-width: 100px; min-width: 100px;">
                    </a>
                  </td>
                </tr>
              </table>
              <!--[if (gte mso 9)|(IE)]>
              </td>
              </tr>
              </table>
              <![endif]-->
            </td>
          </tr>
          <!-- end logo -->
      
          <!-- start hero -->
          <tr>
            <td align="center" bgcolor="#e9ecef">
              <!--[if (gte mso 9)|(IE)]>
              <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
              <tr>
              <td align="center" valign="top" width="600">
              <![endif]-->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                <tr>
                  <td bgcolor="#ffffff" align="left">
                    <img src="https://i.ibb.co/dtZMmcY/Png-Item-34550.png" alt="Welcome" width="600" style="display: block; width: 100%; max-width: 100%;">
                  </td>
                </tr>
              </table>
              <!--[if (gte mso 9)|(IE)]>
              </td>
              </tr>
              </table>
              <![endif]-->
            </td>
          </tr>
          <!-- end hero -->
      
          <!-- start copy block -->
          <tr>
            <td align="center" bgcolor="#e9ecef">
              <!--[if (gte mso 9)|(IE)]>
              <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
              <tr>
              <td align="center" valign="top" width="600">
              <![endif]-->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
      
                <!-- start copy -->
                <tr>
                  <td bgcolor="#ffffff" align="left" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                    <h1 style="margin: 0 0 12px; font-size: 32px; font-weight: 400; line-height: 48px;">Welcome, User</h1>
                    <p style="margin: 0;">Thank you for signing up with Raje Tech API. We strive to produce highly reliable  APIs that you can use for your transactional or marketing needs.</p>
                    <p>Kindly use below API credentials to consume our API</p>
                  </td>
                </tr>
                <!-- end copy -->
      
                <tr >
                <td bgcolor="#ffffff" align="left" style="padding: 10px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
              <h1 align="center" style="font-size: 18px; font-weight: 300;" >User Details</h1>
              <p style="margin: 0;"><b>APIClientID :</b> ${APIClientID}</p> 
              <p style="margin: 0;"><b>APISecretKey :</b> ${APISecretKey}</p> 
              <p style="margin: 0;"><b>AESKey :</b> ${AESKey}</p> 
              <p style="margin: 0;"><b>APILimit :</b> ${APICallLimit}</p> 
              </td></tr>


                <!-- start copy -->
                <tr>
                  <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; border-bottom: 3px solid #d4dadf">
                    <p style="margin: 0;">Cheers,<br> BY.RAJE</p>
                  </td>
                </tr>
                <!-- end copy -->
      
              </table>
              <!--[if (gte mso 9)|(IE)]>
              </td>
              </tr>
              </table>
              <![endif]-->
            </td>
          </tr>
          <!-- end copy block -->
      
          <!-- start footer -->
          <tr>
            <td align="center" bgcolor="#e9ecef" style="padding: 24px;">
              <!--[if (gte mso 9)|(IE)]>
              <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
              <tr>
              <td align="center" valign="top" width="600">
              <![endif]-->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
      
                <!-- start permission -->
                <tr>
                  <td align="center" bgcolor="#e9ecef" style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;">
                    <p style="margin: 0;">You received this email because we received a request for API for your account. If you didn't request Raje Tech API you can safely delete this email.</p>
                  </td>
                </tr>
                <!-- end permission -->
      
              </table>
              <!--[if (gte mso 9)|(IE)]>
              </td>
              </tr>
              </table>
              <![endif]-->
            </td>
          </tr>
          <!-- end footer -->
      
        </table>
        <!-- end body -->
      
      </body>
      </html>`,
    });
    const WelcomeMessageId = info.messageId;
    await UserEmail.findOneAndUpdate(
      { UserID: _id, Email: Email },
      {
        $set: {
          WelcomeMessageId: WelcomeMessageId,
          ModifiedAt: date,
          UserIP: IP,
        },
      },
      { new: true }
    );
  } catch (error) {
    console.log(error);
    const Error = {
      Error: error,
      Email: Email,
      UserID: _id,
    };
    await UserEmail.create(Error);
  }
};

const SendLogs = async (Date, Email) => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.SMTP_SERVER,
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USERNAME, // generated ethereal user
        pass: process.env.SMTP_PASSWORD, // generated ethereal password
      },
    });

    let LogFileName = `APILog-${Date}.log`;
    let ZipLogFileName = `APILog-${Date}.log.gz`;
    CreatePath(process.env.ZIP_LOG_DIR);
    let inputFile = path.join(
      __dirname,
      `../../${process.env.LOG_DIR}/`,
      LogFileName
    );
    let outputFile = path.join(
      __dirname,
      `../../${process.env.ZIP_LOG_DIR}/`,
      ZipLogFileName
    );
    //console.log('API Log Zip file request');
    if (fs.existsSync(outputFile)) {
      //don nothing
      var stats = fs.statSync(outputFile);
      var fileSizeInBytes = stats["size"];
      //Convert the file size to megabytes (optional)
      var fileSizeInMegabytes = fileSizeInBytes / 1000.0;
      //console.log(fileSizeInMegabytes);
    } else {
      await dogzip(inputFile, outputFile);
      var stats = fs.statSync(outputFile);
      var fileSizeInBytes = stats["size"];
      //Convert the file size to megabytes (optional)
      var fileSizeInMegabytes = fileSizeInBytes / 1000.0;
      //console.log(fileSizeInMegabytes);
    }

    if (fileSizeInMegabytes < 25000) {
      let info = await transporter.sendMail({
        from: `"Raje Tech API Admin" <${process.env.SMTP_USERNAME}>`, // sender address
        to: Email, // list of receivers
        cc: process.env.SMTP_USERNAME,
        subject: "Raje Tech REST API Log File", // Subject line
        html: `<br>As Requested Please Find Below API Log Report - <br> <br> For More information Kindly Contact Admin <br>- admin@byraje.com`, // plain text body
        attachments: [
          {
            filename: `${ZipLogFileName}`,
            path: outputFile,
            //path: `D:\\NodeAPI\\EMPAPI\\Logs\\${LogFileName}`,
          },
        ],
      });
      console.log(
        `Email Sent to ->${Email} Log File ->${ZipLogFileName} Date -> ${Date} EmailRefrenceNumber -> ${info.messageId}`
      );
      return info.messageId;
    } else {
      return "SizeError";
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = { ActivationEmail, WelcomeEmail, SendLogs };
