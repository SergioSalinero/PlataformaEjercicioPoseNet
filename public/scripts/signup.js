/**
 * Allows the user to register in the system.
 * @namespace
 * @name signup
 */

import { 
	getUserData,
	getUserCount
} from './apiDAO.js';

var nicknameArray	/* Contains the nicknames of all current users stored in the Firebase database */
var mailArray		/* Contains the emails of all current uses stored in the Firebase database */


/**
 * Initialises nickname and email arrays.
 *
 * @returns {void}
 * @name eventLoad
 * @function
 * @memberof signup
 */
window.addEventListener('DOMContentLoaded', async () => {	
	/* Get user count from the Firebase database */
	const userNum = await getUserCount();
	nicknameArray = new Array(userNum);
	mailArray = new Array(userNum);
	let i = 0;
	
	/* Get user data from the Firebase database */
	const querySnapshot = await getUserData();
	
	querySnapshot.forEach(doc => {
		nicknameArray[i] = doc.data().nickname;
		mailArray[i] = doc.data().email;
		i++;
	})
});


/*:::: Control variables ::::*/
var vNickname = false;
var vMail = false;

/*:::: Reference of sign up button and div error ::::*/
const signupButton = document.getElementById('signup-button');
const errorNickname = document.getElementById('errorNickname');
const errorEmail = document.getElementById('errorEmail');
const errorPassword = document.getElementById('errorPassword');
const errorRePassword = document.getElementById('errorRePassword');


/**
 * Check if nickname written is correct.
 *
 * @param {string} nickname - The user nickname.
 * @returns {void}
 * @name nicknameInput_eventInput
 * @function
 * @memberof signup
 */
const nicknameInput = document.getElementById('nickname');
nicknameInput.addEventListener('input', (event) => {
	vNickname = true;
	event.target.setCustomValidity("");
	
	nicknameInput.style.border = "none";
	nicknameInput.style.backgroundColor = "#e8eeef";
	
	/* Check if the written nickname exists */
	nicknameArray.forEach(element => { 
		if(nicknameInput.value == element && vNickname) {
			vNickname = false;
			errorNickname.innerHTML = "Este usuario ya ha sido registrado";
			nicknameInput.style.border = "1px solid red";
			nicknameInput.style.backgroundColor = "#ffdddd";
			continueButton.disabled = true;
		}
		else if(vNickname){
			errorNickname.innerHTML = "";
			nicknameInput.style.border = "none";
			nicknameInput.style.backgroundColor = "#e8eeef";
		}
	})
});


/**
 * Check if email written is correct.
 *
 * @param {string} email - The user email.
 * @returns {void}
 * @name mailInput_eventInput
 * @function
 * @memberof signup
 */
const mailInput = document.getElementById('mail');
mailInput.addEventListener('input', (event) => {
	vMail = true;
	
	mailInput.style.border = "none";
	mailInput.style.backgroundColor = "#e8eeef";
	
	/* Check if the written email exists */
	mailArray.forEach(element => {
		if(mailInput.value == element && vMail) {
			vMail = false;
			errorEmail.innerHTML = "Este email ya ha sido registrado";
			mailInput.style.border = "1px solid red";
			mailInput.style.backgroundColor = "#ffdddd";
			continueButton.disabled = true;
		}
		else if(vMail){
			errorEmail.innerHTML = "";
			mailInput.style.border = "none";
			mailInput.style.backgroundColor = "#e8eeef";
		}
	})
});


/*:::: Custom warning text ::::*/
nicknameInput.addEventListener('invalid', function(event) {
	event.target.setCustomValidity('Caracteres válidos: Letras de la \'a\'a la \'z\' en minúscula, números del 0 al 9 y el símbolo \'_\'');
})


/*:::: Custom passwords ::::*/
const passwordInput = document.getElementById('password');
const re_passwordInput = document.getElementById('re-password');


/**
 * Check password regex.
 *
 * @param {string} password - The user password.
 * @returns {void}
 * @name passwordInput_eventInput
 * @function
 * @memberof signup
 */
passwordInput.addEventListener('input', (event) => {
	const regex = new RegExp(passwordInput.pattern);
	
	if(!regex.test(password.value)) {
		errorPassword.innerHTML = "La contraseña deberá tener al menos una letra minúscula, una letra mayúscula, un dígito numérico y una longitud de 8 caracteres.";
		passwordInput.style.border = "1px solid red";
		passwordInput.style.backgroundColor = "#ffdddd";
		continueButton.disabled = true;
	} else if(re_passwordInput.value != passwordInput.value && re_passwordInput.value.length != 0) {
		errorPassword.innerHTML = "Las contraseñas no coinciden";
		passwordInput.style.border = "1px solid red";
		passwordInput.style.backgroundColor = "#ffdddd";
		
		re_passwordInput.style.border = "1px solid red";
		re_passwordInput.style.backgroundColor = "#ffdddd";
		continueButton.disabled = true;
	}
	else {
		errorPassword.innerHTML = "";
		passwordInput.style.border = "none";
		passwordInput.style.backgroundColor = "#e8eeef";
		
		if(re_passwordInput.value == passwordInput.value) {
			errorRePassword.innerHTML = "";
			re_passwordInput.style.border = "none";
			re_passwordInput.style.backgroundColor = "#e8eeef";
		}
	}
});


/**
 * Check confirm password regex.
 *
 * @param {string} password - The user password.
 * @returns {void}
 * @name re_passwordInput_eventInput
 * @function
 * @memberof signup
 */
re_passwordInput.addEventListener('input', (event) => {
	const regex = new RegExp(re_passwordInput.pattern);
	
	if(!regex.test(password.value)) {
		errorRePassword.innerHTML = "La contraseña deberá tener al menos una letra minúscula, una letra mayúscula, un dígito numérico y una longitud de 8 caracteres.";
		re_passwordInput.style.border = "1px solid red";
		re_passwordInput.style.backgroundColor = "#ffdddd";
		continueButton.disabled = true;
	} else if(re_passwordInput.value != passwordInput.value && passwordInput.value.length != 0) {
		errorRePassword.innerHTML = "Las contraseñas no coinciden";
		
		re_passwordInput.style.border = "1px solid red";
		re_passwordInput.style.backgroundColor = "#ffdddd";
		continueButton.disabled = true;
	}
	else {
		errorRePassword.innerHTML = "";
		re_passwordInput.style.border = "none";
		re_passwordInput.style.backgroundColor = "#e8eeef";
	}
});
