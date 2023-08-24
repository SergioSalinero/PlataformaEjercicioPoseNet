/**
 * Allows the management of users present in system.
 * @namespace
 * @name usersManagement
 */

import { 
	getUserData,
	getUserCount,
	removeUser,
	updateRole
} from './apiDAO.js';


var id, name, lastname, nickname, mail, creationDate;
const form = document.getElementById('form');
var idA = document.getElementById('id').innerHTML;

const back = document.getElementById('back');
back.href = '/main?id=' + idA;


/**
 * Initialises basic parameters for users management funcionality and display user list present in system.
 *
 * @returns {void}
 * @name eventLoad
 * @function
 * @memberof usersManagement
 */
window.addEventListener('load', async () => {
	/* Get user count from the Firebase database */
	const userNum = await getUserCount();
	id = new Array(userNum);
	name = new Array(userNum);
	lastname = new Array(userNum);
	nickname = new Array(userNum);
	mail = new Array(userNum);
	creationDate = new Array(userNum);
	let i = 0;
	
	/* Get user data from the Firebase database */
	const querySnapshot = await getUserData();
	
	querySnapshot.forEach(doc => {
		id[i] = doc.data().id;
		name[i] = doc.data().name;
		lastname[i] = doc.data().lastname;
		nickname[i] = doc.data().nickname;
		mail[i] = doc.data().email;
		creationDate[i++] = doc.data().creationDate;
	});
	
	const table = document.getElementById('table');
	
	i = 0
	for(i=0; i<id.length; i++) {
		const row = document.createElement('tr');
		
		var cell = document.createElement('td');
		cell.textContent = lastname[i];
		row.appendChild(cell);
		
		var cell = document.createElement('td');
		cell.textContent = name[i];
		row.appendChild(cell);
		
		var cell = document.createElement('td');
		cell.textContent = nickname[i];
		row.appendChild(cell);
		
		var cell = document.createElement('td');
		cell.textContent = mail[i];
		row.appendChild(cell);
		
		var cell = document.createElement('td');
		cell.textContent = id[i];
		row.appendChild(cell);
		
		var cell = document.createElement('td');
		cell.textContent = creationDate[i];
		row.appendChild(cell);
		
		if(i % 2 == 0)
			row.style.backgroundColor = '#1b1b25';
		
		table.appendChild(row);
	}
})


const rmUserI = document.getElementById('rm-user-i');


/**
 * Remove user.
 *
 * @param {string} nickname - The nickname of the user that will be removed.
 * @returns {void}
 * @name rmUser_eventClick
 * @function
 * @memberof usersManagement
 */
const rmUser = document.getElementById('rm-user');
rmUser.addEventListener('click', (event) => {
	event.preventDefault();
	
	var found = false;
	
	for(let i=0; i<id.length; i++) {
		if(rmUserI.value == nickname[i]) {
			found = true;
			form.action = '/user_management?id=' + idA + '&idToRemove=' + id[i];
			removeUser(id[i], form);
		}
	}
	
	if(!found) {
		const message = document.getElementById('error');
		message.innerHTML = "El usuario no existe";
	
		setTimeout(function() {
			message.innerHTML = "";
		}, 3000);
	}
})


const chRole = document.getElementById('ch-role');
const role = document.getElementById('role');


/**
 * Change role of user.
 *
 * @param {string} nickname - The nickname of the user that will be modified.
 * @returns {void}
 * @name chRole_eventClick
 * @function
 * @memberof usersManagement
 */
chRole.addEventListener('click', (evnet) => {
	event.preventDefault();
	
	var found = false;
	
	for(let i=0; i<id.length; i++) {
		if(rmUserI.value == nickname[i]) {
			found = true;
			updateRole(id[i], role.value);
		}
	}
	
	if(!found) {
		const message = document.getElementById('error');
		message.innerHTML = "El usuario no existe";
	
		setTimeout(function() {
			message.innerHTML = "";
		}, 3000);
	}
	else {
		const message = document.getElementById('no-error');
		message.innerHTML = "La modificación se ha almacenado correctamente";
		
		setTimeout(function() {
			message.innerHTML = "";
		}, 3000);
	}
})
