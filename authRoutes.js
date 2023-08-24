/**
 * Authentication paths
 * @namespace
 * @name authentication
 */

const {
	addUser,
	getUser,
	getUserNickname,
	getUserEmail
} = require('./apiDAO.js');


const { sendEmail } = require('./sendEmail.js');

const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const express = require('express');
var path = require('path');

const router = express.Router();


/**
 * Route handler for GET '/signup'.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @memberof authentication
 * @name GET_signup
 * @function
 */
router.get('/signup', function(req, res) {
	res.sendFile(path.join(__dirname, "/public/signup.html"));
})

/**
 * Route handler for POST '/signup'.
 * 
 * @param {object} req - The request object.
 * @param {string} req.body.name - The user name.
 * @param {string} req.body.lastname - The user lastname.
 * @param {string} req.body.nickname - The user nickcname.
 * @param {string} req.body.email - The user email.
 * @param {string} req.body.password - The user password.
 * @param {object} res - The response object.
 * @memberof authentication
 * @name POST_signup
 * @function
 */
router.post('/signup', async function(req, res) {
	const userID = uuidv4();		

	const confirmCode = Math.floor(Math.random() * 90000) + 10000;
		
	const salt = bcrypt.genSaltSync(10);
	const hash = bcrypt.hashSync(req.body.password, salt);
		
	let currentDate = new Date();
		
	let day = currentDate.getDate();
	let month = currentDate.getMonth() + 1;
	let year = currentDate.getFullYear();
		
	let date = day + '/' + month + '/' + year;
		
	addUser(userID, req.body.name, req.body.lastname, req.body.nickname, req.body.email, hash, salt, confirmCode, 'user', date, parseInt(req.body.weight), parseInt(req.body.height), 0, '00:00:00');
	
	sendEmail(req.body.email, 'CÓDIGO DE CONFIRMACIÓN', 'Su código de confirmación es ' + confirmCode + '\nhttp://localhost:3000/confirm_code?id=' + userID);

	res.redirect('/confirm_code?id=' + userID);
})


/**
 * Route handler for GET '/confirm_code'.
 *
 * @param {Object} req - The request object.
 * @param {string} req.query.id - The user ID.
 * @param {Object} res - The response object.
 * @memberof authentication
 * @name GET_confirm_code
 * @function
 */
router.get('/confirm_code', function(req, res) {
	const id = req.query.id;
	res.render('confirmCode', { id });
})

/**
 * Route handler for POST '/confirm_code'.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @memberof authentication
 * @name POST_confirm_code
 * @function
 */
router.post('/confirm_code', function(req, res) {
	res.redirect('/login');
})


/**
 * Route handler for GET '/resend_confirm_code'.
 *
 * @param {Object} req - The request object.
 * @param {string} req.query.id - The user ID.
 * @param {Object} res - The response object.
 * @memberof authentication
 * @name GET_resend_confirm_code
 * @function
 */
router.get('/resend_confirm_code', async function(req, res) {
	const id = req.query.id;
	var confirmCode, email;
	
	const snapshot = await getUser(id);
	
	snapshot.forEach(doc => {
		confirmCode = doc.data().confirmCode;
		email = doc.data().email;
	});
	
	sendEmail(email, 'CÓDIGO DE CONFIRMACIÓN', 'Su código de confirmación es ' + confirmCode + '\nhttp://localhost:3000/confirm_code?id=' + id);
	
	res.render('confirmCode', { id });
})

/**
 * Route handler for POST '/resend_confirm_code'.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @memberof authentication
 * @name POST_resend_confirm_code
 * @function
 */
router.post('/resend_confirm_code', function(req, res) {
	res.redirect('/login');
})


/**
 * Route handler for GET '/login'.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @memberof authentication
 * @name GET_login
 * @function
 */
router.get('/login', function(req, res) {
	res.sendFile(path.join(__dirname, "/public/login.html"));
})

/**
 * Route handler for POST '/login'.
 *
 * @param {Object} req - The request object.
 * @param {string} req.body.nickname - The user nickname.
 * @param {string} req.body.password - The user password.
 * @param {Object} res - The response object.
 * @memberof authentication
 * @name POST_login
 * @function
 */
router.post('/login', async function(req, res) {	
	var password;
	var username;
	var id, confirmCode;
	
	username = req.body.nickname;
		
	const snapshot = await getUserNickname(username);
	
	snapshot.forEach(doc => {
		id = doc.data().id;
		password = doc.data().password;
		confirmCode = doc.data().confirmCode;
	});
	
	if(confirmCode != -1)
		res.redirect('/confirm_code?id=' + id);
	else {
		if(!req.session[id]) {
			req.session[id] = {};
		}
		
		if (!req.session.username) {
			req.session.username = {};
		}
		
		req.session.username[id] = username;
			
		if(bcrypt.compareSync(req.body.password, password))
			res.redirect('/main?id=' + id);
		else
			res.redirect('/login');
	}
})


/**
 * Route handler for GET '/password_recovery'.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @memberof authentication
 * @name GET_password_recovery
 * @function
 */
router.get('/password_recovery', function(req, res) {
	res.sendFile(path.join(__dirname, "/public/passwordRecovery.html"));
})

/**
 * Route handler for POST '/password_recovery'.
 *
 * @param {Object} req - The request object.
 * @param {string} req.body.email - The user email.
 * @param {Object} res - The response object.
 * @memberof authentication
 * @name POST_password_recovery
 * @function
 */
router.post('/password_recovery', async function(req, res) {
	const snapshot = await getUserEmail(req.body.email);
	
	if(snapshot.length == 0)
		res.redirect('/password_recovery');
	
	snapshot.forEach(doc => {
		id = doc.data().id;
	});
	
	sendEmail(req.body.email, 'RECUPERACIÓN DE CONTRASEÑA', 'Para recuperar su contraseña acceda al siguiente enlace http://localhost:3000/reset_password?id=' + id);
	
	res.redirect('/password_recovery');
})

module.exports = router;
