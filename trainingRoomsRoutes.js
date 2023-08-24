/**
 * Training rooms paths
 * @namespace
 * @name trainingRooms
 */

const {
	getUser,
	createTR
} = require('./apiDAO.js');

const { v4: uuidv4 } = require('uuid');
const express = require('express');
var path = require('path');

const router = express.Router();


/**
 * Route handler for GET '/training_rooms'.
 *
 * @param {Object} req - The request object.
 * @param {string} req.query.id - The user ID.
 * @param {Object} res - The response object.
 * @memberof trainingRooms
 * @name GET_training_rooms
 * @function
 */
router.get('/training_rooms', function(req, res) {
	var id = req.query.id;

	if(req.session.username[id] != undefined)
		res.render('trainingRooms', { id });
	else
		res.redirect('/login');
})


/**
 * Route handler for GET '/create_tr'.
 *
 * @param {Object} req - The request object.
 * @param {string} req.query.id - The user ID.
 * @param {Object} res - The response object.
 * @memberof trainingRooms
 * @name GET_create_tr
 * @function
 */
router.get('/create_tr', function(req, res) {
	var id = req.query.id;
	
	if(req.session.username[id] != 0)
		res.render('createTR', { id });
	else
		res.redirect('/login');
})

/**
 * Route handler for POST '/create_tr'.
 * 
 * @param {object} req - The request object.
 * @param {string} req.body.userID - The user ID.
 * @param {string} req.body.nameTR - The training room name.
 * @param {string} req.body.summaryTR - The training room description.
 * @param {object} res - The response object.
 * @memberof trainingRooms
 * @name POST_create_tr
 * @function
 */
router.post('/create_tr', async function(req, res) {
	var id = req.body.userID;
	var nameTR = req.body.name_tr;
	var summaryTR = req.body.summary_tr;
	var name, lastname;
	
	const snapshot = await getUser(id);
	
	snapshot.forEach(doc => {
		name = doc.data().name;
		lastname = doc.data().lastname;
	});
	
	let currentDate = new Date();
		
	let day = currentDate.getDate();
	let month = currentDate.getMonth() + 1;
	let year = currentDate.getFullYear();
	
	nameTR = nameTR.toUpperCase();
	
	createTR(uuidv4(), id, name, lastname, nameTR, summaryTR, 0, 0, 0, year, month, day);
	
	res.redirect('/training_rooms?id=' + id);
})


/**
 * Route handler for GET '/specific_tr'.
 *
 * @param {Object} req - The request object.
 * @param {string} req.query.id - The user ID.
 * @param {string} req.query.roomID - the training room ID.
 * @param {Object} res - The response object.
 * @memberof trainingRooms
 * @name GET_specific_tr
 * @function
 */
router.get('/specific_tr', function(req, res) {
	var userID = req.query.userID;
	var roomID = req.query.roomID;

	if((typeof req.session.username[userID] == "undefined") || req.session.username[userID] != 0)
		res.render('specificTR', { userID, roomID });
	else
		res.redirect('/login');
})

/**
 * Route handler for POST '/specific_Tr'.
 * 
 * @param {object} req - The request object.
 * @param {string} req.body.userID - The user ID.
 * @param {string} req.body.TRID - The training room ID.
 * @param {object} res - The response object.
 * @memberof trainingRooms
 * @name POST_specific_tr
 * @function
 */
router.post('/specific_tr', function(req, res) {
	var userID = req.body.userID;
	var TRID = req.body.TRID;

	res.redirect('/poseNet?id=' + userID + '&TR=' + TRID);
})


/**
 * Route handler for GET '/edit_tr'.
 *
 * @param {Object} req - The request object.
 * @param {string} req.query.id - The user ID.
 * @param {string} req.query.roomID - the training room ID.
 * @param {Object} res - The response object.
 * @memberof trainingRooms
 * @name GET_edit_tr
 * @function
 */
router.get('/edit_tr', function(req, res) {
	var userID = req.query.userID;
	var roomID = req.query.roomID;

	if(req.session.username[userID] != 0)
		res.render('editTR', { userID, roomID });
	else
		res.redirect('/login');
})

/**
 * Route handler for POST '/edit_Tr'.
 * 
 * @param {object} req - The request object.
 * @param {string} req.body.userID - The user ID..
 * @param {object} res - The response object.
 * @memberof trainingRooms
 * @name POST_edit_tr
 * @function
 */
router.post('/edit_tr', function(req, res) {
	var id = req.body.userID;
	
	res.redirect('/main?id=' + id);
})

module.exports = router;
