/**
 * Login file.
 * @namespace
 * @name login
 */

import { 
	getUserData,
	getUserCount,
} from './apiDAO.js';

var nicknameArray	/* Contains the nicknames of all current users stored in the Firebase database */
var userID;


/**
 * Initializes the nicknames vector.
 *
 * @returns {void}
 * @name eventLoad
 * @function
 * @memberof login
 */
window.addEventListener('DOMContentLoaded', async () => {	
	/* Get user num from the Firebase database */
	const userNum = await getUserCount();
	nicknameArray = new Array(userNum);
	let i = 0;
	
	/* Get user data from the Firebase database */
	const querySnapshot = await getUserData();
	
	querySnapshot.forEach(doc => {
		nicknameArray[i] = doc.data().nickname;
		i++;
	})
});


/*:::: Reference of sign up button and div error ::::*/
const loginButton = document.getElementById('login-button');
const divError = document.getElementById('error');


/*:::: Reference of FORM ::::*/
const loginForm = document.getElementById('login-form');


/**
 * Submit the login form
 *
 * @param {string} nickname - The user nickname.
 * @param {string} password - The user password.
 * @returns {void}
 * @name login_eventSubmit
 * @function
 * @memberof login
 */
loginForm.addEventListener('submit', async (event) => {
	var userFound = false;
	
	const nickname = loginForm['nickname'];
		
	nicknameArray.forEach(element => { 
		if(nickname.value == element) {
			userFound = true;
		}
	})
	
	if(!userFound) {
		error.innerHTML = "El usuario y/o la contraseña no son válidos";
		event.preventDefault();
	}
});
