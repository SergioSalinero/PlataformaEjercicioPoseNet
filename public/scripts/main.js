/**
 * Home view.
 * @namespace
 * @name home
 */

import { 
	getConfirmCode,
	getUserID,
	getSpecificMensualStadistics,
	getUserDataRanking,
	getUserCount
} from './apiDAO.js';

const id = document.getElementById('id').innerHTML;
var role, username;


/**
 * Initializes basic params for home view.
 *
 * @param {string} id - The user ID.
 * @returns {void}
 * @name eventLoad
 * @function
 * @memberof home
 */
window.addEventListener('load', async function(event) {
	const querySnapshot = await getUserID(id);
	
	var routines, trainingTime;
	
	querySnapshot.forEach(doc => {
		username = doc.data().nickname;
		role = doc.data().role;
		routines = doc.data().routines;
		trainingTime = doc.data().trainingTime;
	});
	
	document.getElementById('up-stadistics').innerHTML = "<strong>" + routines + "</strong> rutinas realizadas" + " / <strong>" + trainingTime + "</strong> tiempo entrenado";

	document.getElementById('nickname').innerHTML = username;
	
	var linkUser = document.getElementById('users');
	linkUser.href = "/user_management?id=" + id;
	linkUser = document.getElementById('build-routine');
	linkUser.href = "/make_routine?id=" + id + '&TR=0';
	linkUser = document.getElementById('training-rooms');
	linkUser.href = "/training_rooms?id=" + id;
	linkUser = document.getElementById('my-routines');
	linkUser.href = "/my_routines?id=" + id;
	linkUser = document.getElementById('my-stadistics');
	linkUser.href = "/stadistics?id=" + id;
	linkUser = document.getElementById('profile');
	linkUser.href = "/profile?id=" + id;
	linkUser = document.getElementById('logout');
	linkUser.href = "/logout?id=" + id;
	
	if(role == "manager") {
		var manager = document.getElementById('users');
		manager.style.display = "inline";
	}

	ranking();
});


var options = document.getElementById('options');
var toggleDiv = document.getElementById('toggle-div');


/**
 * Shows part of the home page funcionality.
 *
 * @returns {void}
 * @name options_eventClick
 * @function
 * @memberof home
 */
options.addEventListener('click', function(event) {

	options.style.opacity = "0";
	options.style.transition = "opacity 0.3s";
	
	setTimeout(function () {
		if(options.textContent == "☰")
			options.textContent = "✕";
		else
			options.textContent = "☰";
		options.style.opacity = "1";
		options.style.transition = "opacity 0.3s";
	}, 350);

	toggleDiv.classList.toggle('visible');
});


/**
 * Configuring the global training ranking.
 *
 * @returns {void}
 * @name ranking
 * @function
 * @memberof home
 */
async function ranking() {
	const userNum = await getUserCount();
	var users = new Array(userNum);
	
	const querySnapshot = await getUserDataRanking();
	querySnapshot.forEach(doc => {
		users.push([
			doc.data().nickname,
			doc.data().secondsTrained
		]);
	});
	
	users = users.slice(1);

	const table = document.getElementById('myTable');
	
	for(let i=0; i<users.length; i++) {
		const rowContent = `${padName((i+1) + " " + users[i][0])}${users[i][1]}`;

		const row = document.createElement('tr');
		
		var cell = document.createElement('td');
		if(username == users[i][0])
			cell.innerHTML = "<strong>" + rowContent + "</strong>";
		else
			cell.innerHTML = rowContent;
		row.appendChild(cell);
		
		table.appendChild(row);
	}
	
}


/**
 * Style for ranking.
 *
 * @param {string} name - String of a certain ranking position.
 * @returns {void}
 * @name padName
 * @function
 * @memberof home
 */
function padName(name) {
	return name.padEnd(40, ".");
}

