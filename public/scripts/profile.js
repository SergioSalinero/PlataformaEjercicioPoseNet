/**
 * Shows and allows edit the user personal data.
 * @namespace
 * @name profile
 */

import { 
	getUserID,
	getUserData,
	getUserCount,
	updateUserData
} from './apiDAO.js';


var name, lastname, nickname, email, weight, height, id;
var mailArray;


/**
 * Initialises personal data.
 *
 * @param {string} id - The user ID.
 * @returns {void}
 * @name eventLoad
 * @function
 * @memberof profile
 */
window.addEventListener('DOMContentLoaded', async () => {	
	id = document.getElementById('id').innerHTML;
	var userID = document.getElementById('userID');
	userID.value = id;
	
	const back = document.getElementById('back');
	back.href = '/main?id=' + id;
	
	const removeAccount = document.getElementById('remove-account');
	removeAccount.href = '/remove_account?id=' + id;
	
	/* Get determinate user data from the Firebase database */
	var querySnapshot = await getUserID(id);
	
	querySnapshot.forEach(doc => {
		name = doc.data().name;
		lastname = doc.data().lastname;
		nickname = doc.data().nickname;
		email = doc.data().email;
		weight = doc.data().weight;
		height = doc.data().height;
	})
	
	/* Get user count from the Firebase database */
	const userNum = await getUserCount();
	mailArray = new Array(userNum);
	let i = 0;
	
	/* Get user data from the Firebase database */
	querySnapshot = await getUserData();
	
	querySnapshot.forEach(doc => {
		mailArray[i++] = doc.data().email;
	})
	
	document.getElementById('name').innerHTML += ' ' + name;
	document.getElementById('lastname').innerHTML += ' ' + lastname;
	document.getElementById('username').innerHTML += ' ' + nickname;
	document.getElementById('email').innerHTML += ' ' + email;
	document.getElementById('weight').innerHTML += ' ' + weight;
	document.getElementById('height').innerHTML += ' ' + height;
})


/**
 * Check available email input.
 *
 * @param {string} email - The user new email.
 * @returns {void}
 * @name mailInput_eventInput
 * @function
 * @memberof profile
 */
const mailInput = document.getElementById('mailI');
const error = document.getElementById('error');
const saveButton = document.getElementById('save-button');
mailInput.addEventListener('input', (event) => {
	var vMail = true;
	
	mailInput.style.border = "none";
	mailInput.style.backgroundColor = "#e8eeef";
	
	/* Check if the written email exists */
	mailArray.forEach(element => {
		if(mailInput.value == element) {
			vMail = false;
			error.innerHTML = "Este email ya ha sido registrado";
			mailInput.style.border = "1px solid red";
			mailInput.style.backgroundColor = "#ffdddd";
			saveButton.disabled = true;
		}
		else if(vMail){
			vMail = true;
			error.innerHTML = "";
			mailInput.style.border = "none";
			mailInput.style.backgroundColor = "#e8eeef";

			saveButton.disabled = false;
		}
	})
	
	if(vMail) {
		const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		if (!regex.test(mailInput.value)) {
			error.innerHTML = "Introduzca un email válido";
			mailInput.style.border = "1px solid red";
			mailInput.style.backgroundColor = "#ffdddd";
			saveButton.disabled = true;
		} else {
			error.innerHTML = "";
			mailInput.style.border = "none";
			mailInput.style.backgroundColor = "#e8eeef";
			saveButton.disabled = false;
		}
	}
});


/**
 * Open the edit panel and shows personal data.
 *
 * @param {string} name - The user new name.
 * @param {string} lastname - The user new lastname.
 * @param {string} mail - The user new email.
 * @param {string} weight - The user new weight.
 * @param {string} height - The user new height.
 * @returns {void}
 * @name edit_eventClick
 * @function
 * @memberof profile
 */
var nameI, lastnameI, mailI, weightI, heightI;
const edit = document.getElementById('edit');
edit.addEventListener('click', (event) => {
	var profile = document.getElementById('profile');
	profile.hidden = "true";
	var editProfile = document.getElementById('save-form');
	editProfile.style.display = "block";
	
	nameI = document.getElementById('nameI');
	nameI.value = name;
	lastnameI = document.getElementById('lastnameI');
	lastnameI.value = lastname;
	mailI = document.getElementById('mailI');
	mailI.value = email;
	weightI = document.getElementById('weightI');
	weightI.value = weight;
	heightI = document.getElementById('heightI');
	heightI.value = height;
});


/**
 * Save changes.
 *
 * @param {string} nameI - The user new name.
 * @param {string} lastnameI - The user new lastname.
 * @param {string} mailI - The user new email.
 * @param {string} weightI - The user new weight.
 * @param {string} heightI - The user new height.
 * @returns {void}
 * @name saveButton_eventClick
 * @function
 * @memberof profile
 */
saveButton.addEventListener('click', (event) => {
	event.preventDefault();
	updateUserData(nameI.value, lastnameI.value, id, mailI.value, weightI.value, heightI.value, document.getElementById('form'));
})
