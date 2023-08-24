/**
 * Allows to user reset his password.
 * @namespace
 * @name resetPassword
 */

import { 
	getUserData,
	getUserCount
} from './apiDAO.js';


const id = document.getElementById('id').innerHTML;
const userId = document.getElementById('userID');
userId.value = id

const divError = document.getElementById('error');

/*:::: Custom passwords ::::*/
const passwordInput = document.getElementById('password');
const re_passwordInput = document.getElementById('re-password');
const passButton = document.getElementById('pass-button');


/**
 * Check password regex.
 *
 * @param {string} password - The user password.
 * @returns {void}
 * @name passwordInput_eventInput
 * @function
 * @memberof resetPassword
 */
passwordInput.addEventListener('input', (event) => {
	const regex = new RegExp(passwordInput.pattern);
	
	if(!regex.test(password.value)) {
		error.innerHTML = "La contraseña deberá tener al menos una letra minúscula, una letra mayúscula, un dígito numérico y una longitud de 8 caracteres.";
		passwordInput.style.border = "1px solid red";
		passwordInput.style.backgroundColor = "#ffdddd";
		passButton.disabled = true;
	} else if(re_passwordInput.value != passwordInput.value) {
		error.innerHTML = "Las contraseñas no coinciden";
		passwordInput.style.border = "none";
		passwordInput.style.backgroundColor = "#e8eeef";
		
		re_passwordInput.style.border = "1px solid red";
		re_passwordInput.style.backgroundColor = "#ffdddd";
		passButton.disabled = true;
	}
	else {
		error.innerHTML = "";
		passwordInput.style.border = "none";
		passwordInput.style.backgroundColor = "#e8eeef";
		
		re_passwordInput.style.border = "none";
		re_passwordInput.style.backgroundColor = "#e8eeef";
		
		passButton.disabled = false;
	}
});


/**
 * Check confirm password regex.
 *
 * @param {string} password - The user password.
 * @returns {void}
 * @name re_passwordInput_eventInput
 * @function
 * @memberof resetPassword
 */
re_passwordInput.addEventListener('input', (event) => {
	const regex = new RegExp(re_passwordInput.pattern);
	
	if(!regex.test(password.value)) {
		error.innerHTML = "La contraseña deberá tener al menos una letra minúscula, una letra mayúscula, un dígito numérico y una longitud de 8 caracteres.";
		re_passwordInput.style.border = "1px solid red";
		re_passwordInput.style.backgroundColor = "#ffdddd";
		passButton.disabled = true;
	} else if(re_passwordInput.value != passwordInput.value) {
		error.innerHTML = "Las contraseñas no coinciden";
		
		re_passwordInput.style.border = "1px solid red";
		re_passwordInput.style.backgroundColor = "#ffdddd";
		passButton.disabled = true;
	}
	else {
		error.innerHTML = "";
		re_passwordInput.style.border = "none";
		re_passwordInput.style.backgroundColor = "#e8eeef";
		
		passButton.disabled = false;
	}
});
