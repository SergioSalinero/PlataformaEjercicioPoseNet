/**
 * Build routines paths.
 * @namespace
 * @name makeRoutine
 */

const {
	getUser,
	getSubscriptions
} = require('./apiDAO.js');

const { sendEmail } = require('./sendEmail.js');

const express = require('express');
var path = require('path');

const router = express.Router();


/**
 * Route handler for GET '/make_routine'.
 *
 * @param {Object} req - The request object.
 * @param {string} req.query.id - The user ID.
 * @param {string} req.query.TR - The training room ID.
 * @param {Object} res - The response object.
 * @memberof makeRoutine
 * @name GET_make_routine
 * @function
 */
router.get('/make_routine', function(req, res) {
	var id = req.query.id;
	var TR = req.query.TR;
	
	if(req.session.username[id])
		res.render('makeRoutine', { id, TR });
	else
		res.redirect('/login');
})

/**
 * Route handler for POST '/make_routine'.
 * 
 * @param {object} req - The request object.
 * @param {string} req.body.userID - The user ID.
 * @param {string} req.body.TRID - The training room ID.
 * @param {object} res - The response object.
 * @memberof makeRoutine
 * @name POST_make_routine
 * @function
 */
router.post('/make_routine', async function(req, res) {
	var id = req.body.userID;
	var TR = req.body.TRID;
	
	if(TR == 0)
		res.redirect('/poseNet?id=' + id + '&TR=' + TR);
	else {
		var querySnapshot = await getSubscriptions(TR);
		
		var users = [];
		var email = [];
		
		querySnapshot.forEach(doc => {
			users.push(doc.data().userID);
		});

		for(let i=0; i<users.length; i++) {
			querySnapshot = await getUser(users[i]);
			
			querySnapshot.forEach(doc => {
				sendEmail(doc.data().email, 'ACTUALIZACIÓN EN SALA DE ENTRENAMIENTO', 'http://localhost:3000/specific_tr?userID=' + users[i] + '&roomID=' + TR);
			});
		}
	
		res.redirect('/specific_tr?userID=' + id + '&roomID=' + TR);
	}
})

module.exports = router;
