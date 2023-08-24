/**
 * Send email funcionality.
 * @namespace
 * @name emailConnection
 */

const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
  host: 'smtp.outlook.com',
  port: 587,
  secure: false,
  auth: {
    user: 'vrkning@outlook.com',
    pass: 'virkning-368777473'
  }
});


/**
 * Route handler for POST '/poseNet'.
 * 
 * @param {object} req - The request object.
 * @param {string} to - Message destination.
 * @param {string} subject - Message subject
 * @param {string} text - Message content
 * @param {object} res - The response object.
 * @memberof poseNet
 * @function sendEmail
 */
exports.sendEmail = (to, subject, text) => {
	let mailOptions = {
		from: 'vrkning@outlook.com',
		to: to,
		subject: subject,
		text: text
	};

	transporter.sendMail(mailOptions, false);
}
