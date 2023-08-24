/**
 * PoseNet paths.
 * @namespace
 * @name poseNet
 */

const express = require('express');
var path = require('path');

const router = express.Router();


/**
 * Route handler for GET '/poseNet'.
 *
 * @param {Object} req - The request object.
 * @param {string} req.query.id - The user ID.
 * @param {string} req.query.TR - The training room ID.
 * @param {Object} res - The response object.
 * @memberof poseNet
 * @name GET_poseNet
 * @function
 */
router.get('/poseNet', async function(req, res) {
	var id = req.query.id;
	var TR = req.query.TR;

	if(req.session.username[id] != 0)
		res.render('poseNet', { id, TR });
	else
		res.redirect('/login');
})

/**
 * Route handler for POST '/poseNet'.
 * 
 * @param {object} req - The request object.
 * @param {string} req.body.userID - The user ID.
 * @param {string} req.body.TRID - The training room ID.
 * @param {object} res - The response object.
 * @memberof poseNet
 * @name POST_poseNet
 * @function
 */
router.post('/poseNet', function(req, res) {
	var id = req.body.userID;
	var TR = req.body.TRID;
	
	res.redirect('/routine_stadistics?id=' + id + '&TR=' + TR);
})


/**
 * Route handler for GET '/routine_stadistics'.
 *
 * @param {Object} req - The request object.
 * @para {string} req.query.id - The user ID.
 * @para {string} req.query.TR - The training room ID.
 * @param {Object} res - The response object.
 * @memberof poseNet
 * @name GET_routine_stadistics
 * @function
 */
router.get('/routine_stadistics', async function(req, res) {
	var id = req.query.id;
	var TR = req.query.TR;
	
	if(req.session.username[id] != 0)
		res.render('routineStadistics', { id, TR });
	else
		res.redirect('/login');
})

/**
 * Route handler for POST '/routine_stadistics'.
 * 
 * @param {object} req - The request object.
 * @param {string} req.body.userID - The user ID.
 * @param {string} req.body.TRID - The training room ID.
 * @param {object} res - The response object.
 * @memberof poseNet
 * @name POST_routine_stadistics
 * @function
 */
router.post('/routine_stadistics', function(req, res) {
	var id = req.body.userID;
	var TR = req.body.TRID;
	
	if(TR == 0)
		res.redirect('/main?id=' + id);
	else
		res.redirect('/specific_tr?userID=' + id + '&roomID=' + TR);
})

module.exports = router;
