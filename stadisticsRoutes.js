/**
 * Stadistics paths
 * @namespace
 * @name stadistics
 */

const express = require('express');
var path = require('path');

const router = express.Router();


/**
 * Route handler for GET '/my_routines'.
 *
 * @param {Object} req - The request object.
 * @param {string} req.query.id - The user ID.
 * @param {Object} res - The response object.
 * @memberof stadistics
 * @name GET_my_routines
 * @function
 */
router.get('/my_routines', function(req, res) {
	var id = req.query.id;
	
	if(req.session.username[id] != 0)
		res.render('myRoutines', { id });
	else
		res.redirect('login');
})

/**
 * Route handler for GET '/stadistics'.
 *
 * @param {Object} req - The request object.
 * @param {string} req.query.id - The user ID.
 * @param {Object} res - The response object.
 * @memberof stadistics
 * @name GET_stadistics
 * @function
 */
router.get('/stadistics', function(req, res) {
	var id = req.query.id;
	
	res.render('stadistics', { id });
})

module.exports = router;
