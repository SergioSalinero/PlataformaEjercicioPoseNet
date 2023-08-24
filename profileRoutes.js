/**
 * Profile paths.
 * @namespace
 * @name profile
 */

const { 
	getUser,
	resetPassword,
	removeAccount
} = require('./apiDAO.js');

const bcrypt = require('bcryptjs');
const express = require('express');
var path = require('path');

const router = express.Router();


/**
 * Route handler for GET '/logout'.
 *
 * @param {Object} req - The request object.
 * @param {string} req.query.id - The user ID.
 * @param {Object} res - The response object.
 * @memberof profile
 * @name GET_logout
 * @function
 */
router.get('/logout', function(req, res) {
	var id = req.query.id;
	
	req.session.username[id] = 0;
	res.redirect('/login');
})


/**
 * Route handler for GET '/reset_password'.
 *
 * @param {Object} req - The request object.
 * @param {string} req.query.id - The user ID.
 * @param {Object} res - The response object.
 * @memberof profile
 * @name GET_reset_password
 * @function
 */
router.get('/reset_password', function(req, res) {
	var id = req.query.id;
	
	if(!id)
		res.redirect('/login');
	else {
		res.render('resetPassword', { id });
	}
})

/**
 * Route handler for POST '/reset_password'.
 * 
 * @param {object} req - The request object.
 * @param {string} req.body.userID - The user ID.
 * @param {string} req.body.password - The user password.
 * @param {object} res - The response object.
 * @memberof profile
 * @name POST_reset_password
 * @function
 */
router.post('/reset_password', async function(req, res) {
	const salt = bcrypt.genSaltSync(10);
	const hash = bcrypt.hashSync(req.body.password, salt);
	
	resetPassword(req.body.userID, hash, salt);
	
	res.redirect('/login');
})


/**
 * Route handler for GET '/user_management'.
 *
 * @param {Object} req - The request object.
 * @param {string} req.query.id - The user ID.
 * @param {Object} res - The response object.
 * @memberof profile
 * @name GET_user_management
 * @function
 */
router.get('/user_management', function(req, res) {
	var id = req.query.id;
		
	if(req.session.username[id] != 0)
		res.render('usersManagement', { id });
	else
		res.redirect('/login');
})

/**
 * Route handler for POST '/user_management'.
 * 
 * @param {object} req - The request object.
 * @param {string} req.body.id - The user ID.
 * @param {string} req.body.idToRemove - The user ID to remove.
 * @param {object} res - The response object.
 * @memberof profile
 * @name POST_user_management
 * @function
 */
router.post('/user_management', function(req, res) {
	var id = req.query.id;
	var idToRemove = req.query.idToRemove;
	
	if(typeof req.session.username[idToRemove] != 'undefined')
		req.session.username[idToRemove] = 0;
	
	res.redirect('/user_management?id=' + id);
})


/**
 * Route handler for GET '/profile'.
 *
 * @param {Object} req - The request object.
 * @param {string} req.query.id - The user ID.
 * @param {Object} res - The response object.
 * @memberof profile
 * @name GET_profile
 * @function
 */
router.get('/profile', function(req, res) {
	var id = req.query.id;
	
	if(req.session.username[id] != 0)
		res.render('profile', { id });
	else
		res.redirect('/login');
})

/**
 * Route handler for POST '/profile'.
 * 
 * @param {object} req - The request object.
 * @param {string} req.body.id - The user ID.
 * @param {object} res - The response object.
 * @memberof profile
 * @name POST_profile
 * @function
 */
router.post('/profile', function(req, res) {
	var id = req.body.userID;
	
	if(req.session.username[id] != 0)
		res.redirect('/profile?id=' + id);
	else
		res.redirect('/loign');
})


/**
 * Route handler for GET '/remove_account'.
 *
 * @param {Object} req - The request object.
 * @param {string} req.query.id - The user ID.
 * @param {Object} res - The response object.
 * @memberof profile
 * @name GET_remove_account
 * @function
 */
router.get('/remove_account', function(req, res) {
	var id = req.query.id;
	
	if(req.session.username[id] != 0)
		res.render('removeAccount', { id });
	else
		res.redirect('/login');
})

/**
 * Route handler for POST '/remove_account'.
 * 
 * @param {object} req - The request object.
 * @param {string} req.body.id - The user ID.
 * @param {object} res - The response object.
 * @memberof profile
 * @name POST_remove_account
 * @function
 */
router.post('/remove_account', async function(req, res) {
	var id = req.body.userID;
	var password;
	
	var snapshot = await getUser(id);
	
	snapshot.forEach(doc => {
		password = doc.data().password;
	});
	
	if(bcrypt.compareSync(req.body.password, password)) {
		removeAccount(id);
		
		if(typeof req.session.username[id] != 'undefined')
			req.session.username[id] = 0;
		
		res.redirect('/login');
	} else
		res.redirect('/remove_account?id=' + id);
})

module.exports = router;
