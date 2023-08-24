/**
 * Confirm Code file.
 * @namespace
 * @name confirmCode
 */

import { 
	getUserID,
	getConfirmCode,
	updateConfirmCode
} from './apiDAO.js';

var username;
var confirmCode;

const confirm = document.getElementById('confirm-form');
var id = document.getElementById('id').innerHTML;


/**
 * Function to load the user data and configure the confirmation code resend link.
 *
 * @param {string} id - The ID of the user.
 * @returns {void}
 * @name eventLoad
 * @function
 * @memberof confirmCode
 */
window.addEventListener('DOMContentLoaded', async () => {		
	const querySnapshot = await getUserID(id);
	
	querySnapshot.forEach(doc => {
		username = doc.data().nickname;
		confirmCode = doc.data().confirmCode;
	});
	
	const resend = document.getElementById('resend');
	resend.href = '/resend_confirm_code?id=' + id;
});


/**
 * Function that initializes the confirmation code, updates the confirmation code if it is correct and submit the form.
 *
 * @param {string} id - ID of the user.
 * @returns {void}
 * @name confirm_eventSubmit
 * @function
 * @memberof confirmCode
 */
confirm.addEventListener('submit', (event) => {
	event.preventDefault();
	const code = document.getElementById('code');
	
	if(code.value != confirmCode)
		error.innerHTML = "El código introducido no es correcto";
	else
		updateConfirmCode(id, confirm);
});
