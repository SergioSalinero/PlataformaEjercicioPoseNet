/**
 * Home paths
 * @namespace
 * @name home
 */

const express = require('express');
var path = require('path');


/**
 * Express router instance.
 * @type {express.Router}
 * @memberof home
 */
const router = express.Router();


/**
 * Route handler for GET '/'.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @memberof home
 * @name home
 * @function
 */
router.get('/', function(req, res) {
	res.redirect('/login');
})

/**
 * Route handler for GET '/main'.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @memberof home
 * @name main
 * @function
 */
router.get('/main', function(req, res) {
	var id = req.query.id;

	if(req.session.username[id] != 0)
		res.render('main', { id });
	else
		res.redirect('/login');
})

/**
 * Router module for handling routes.
 * @module router
 * @exports router
 * @memberof home
 */
module.exports = router;
