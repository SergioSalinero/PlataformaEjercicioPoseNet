/**
 * DAO API backend.
 * @namespace
 * @name apiDAO
 */


/**
 * Requires the Firestore module from the '@google-cloud/firestore' package.
 * @requires Firestore
 * @memberof apiDAO
 */
const Firestore = require('@google-cloud/firestore');


/**
 * Creates a new Firestore instance.
 *
 * @name db
 * @type {Firestore}
 * @memberof apiDAO
 * @instance
 * @property {string} projectID - The ID of the Firestore project.
 * @property {string} keyFilename - The path to the JSON key file for authentication.
 */
const db = new Firestore({
	projectID: 'posenet-application',
	keyFilename: './firebase-PoseNetApplication.json'
});


/**
 * Adds a new user to the database.
 *
 * @param {string} id - The user ID.
 * @param {string} name - The user's name.
 * @param {string} lastname - The user's last name.
 * @param {string} nickname - The user's nickname.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @param {string} salt - The user's salt for password encryption.
 * @param {number} confirmCode - The user's confirmation code.
 * @param {string} role - The user's role.
 * @param {string} creationDate - The user's creation date.
 * @param {number} weight - The user's weight.
 * @param {number} height - The user's height.
 * @param {number} routines - The user's routines.
 * @param {string} trainingTime - The user's training time.
 * @returns {void}
 * @memberof apiDAO
 * @function addUser
 */
exports.addUser = (id, name, lastname, nickname, email, password, salt, confirmCode, role, creationDate, weight, height, routines, trainingTime) => {
	db.collection('userData').add({
		id: id,
		name: name,
		lastname: lastname,
		nickname: nickname,
		email: email,
		password: password,
		salt: salt,
		confirmCode: confirmCode,
		role: role,
		creationDate: creationDate,
		weight: weight,
		height: height,
		routines: routines,
		trainingTime: trainingTime
	});
}

/**
 * Retrieves user data based on the provided ID.
 *
 * @param {string} id - The ID of the user.
 * @returns {Promise} A promise that resolves with the user data.
 * @memberof apiDAO
 * @function getUser
 */
exports.getUser =  (id) => {
	return db.collection('userData').where('id', '==', id).get();
}

/**
 * Retrieves user data based on the given nickname.
 *
 * @param {string} nickname - The user's nickname.
 * @returns {Promise} A Promise that resolves to the query result containing user data.
 * @memberof apiDAO
 * @function getUserNickname
 */
exports.getUserNickname = (nickname) => {
	return db.collection('userData').where('nickname', '==', nickname).get();
}

/**
 * Retrieves user data based on email from the 'userData' collection.
 *
 * @param {string} email - The email to search for.
 * @returns {Promise} A promise that resolves to the query snapshot containing the user data.
 * @memberof apiDAO
 * @function getUserEmail
 */
exports.getUserEmail = (email) => {
	return db.collection('userData').where('email', '==', email).get();
}

/**
 * Resets the password for a user.
 *
 * @param {string} id - The user ID.
 * @param {string} hash - The new password hash.
 * @param {string} salt - The new salt for password hashing.
 * @returns {void}
 * @memberof apiDAO
 */
exports.resetPassword = async (id, hash, salt) => {
	const userDataRef = await db.collection('userData');
	const query = userDataRef.where('id', '==', id);
	
	query.get().then((querySnapshot) => {
		querySnapshot.forEach((doc) => {
			doc.ref.update({ 
				password: hash,
				salt: salt
			});
		});
	});
}

/**
 * Retrieves subscriptions based on a given room ID.
 *
 * @param {string} TR - The room ID.
 * @returns {Promise} A promise that resolves to the subscriptions matching the room ID.
 * @memberof apiDAO
 * @function getSubscriptions
 */
exports.getSubscriptions = (TR) => {
	return db.collection('subscriptions').where('roomID', '==', TR).get();
}

/**
 * Delete user data given the user ID.
 *
 * @param {string} TR - The room ID.
 * @returns {void}
 * @memberof apiDAO
 * @function removeAccount
 */
exports.removeAccount = async (id) => {
	var snapshot = await db.collection('userData').where('id', '==', id).get();
	snapshot.forEach(doc => {
			doc.ref.delete();
		});
		
	snapshot = await db.collection('currentRoutine').where('userID', '==', id).get();
	if(snapshot.length != 0) {
		snapshot.forEach(doc => {
			doc.ref.delete();
		});
	}
		
	snapshot = await db.collection('myRoutines').where('userID', '==', id).get();
	if(snapshot.length != 0) {
		snapshot.forEach(doc => {
			doc.ref.delete();
		});
	}
	
	snapshot = await db.collection('history').where('userID', '==', id).get();
	if(snapshot.length != 0) {
		snapshot.forEach(doc => {
			doc.ref.delete();
		});
	}
	
	snapshot = await db.collection('subscriptions').where('userID', '==', id).get();
	if(snapshot.length != 0) {
		snapshot.forEach(doc => {
			doc.ref.delete();
		});
	}
	
	snapshot = await db.collection('mensualStadistics').where('userID', '==', id).get();
	if(snapshot.length != 0) {
		snapshot.forEach(doc => {
			doc.ref.delete();
		});
	}
}

/**
 * Creates a new training room in the database.
 *
 * @param {string} id - The ID of the training room.
 * @param {string} userID - The ID of the user associated with the training room.
 * @param {string} trainerName - The name of the trainer.
 * @param {string} trainerLastname - The last name of the trainer.
 * @param {string} name - The name of the training room.
 * @param {string} description - The description of the training room.
 * @param {number} views - The number of views of the training room.
 * @param {number} rating - The rating of the training room.
 * @param {number} ratingCont - Absolute rating counter.
 * @param {number} year - The year of the training room.
 * @param {number} month - The month of the training room.
 * @param {number} day - The day of the training room.
 * @returns {void}
 * @memberof apiDAO
 * @function createTR
 */
exports.createTR = (id, userID, trainerName, trainerLastname, name, description, views, rating, ratingCont, year, month, day) => {
	db.collection('TRs').add({
		id: id,
		userID: userID,
		trainerName: trainerName,
		trainerLastname: trainerLastname,
		name: name,
		description: description,
		views: views,
		rating: rating,
		ratingCont: ratingCont,
		year: year,
		month: month,
		day: day
	});
}
