/**
 * Shows and configure training rooms.
 * @namespace
 * @name trainingRooms
 */

import { 
	getTrainingRoomsFilter,
	getTrainingRoomsDate,
	getUserID
} from './apiDAO.js';

const id = document.getElementById('id').innerHTML;

const container = document.getElementById('grid-container');


/**
 * Initialises basic parameters for training room funcionality.
 *
 * @param {string} id - The user ID.
 * @returns {void}
 * @name eventLoad
 * @function
 * @memberof trainingRooms
 */
window.addEventListener('load', async function(event) {

	const createTR = document.getElementById('create-tr');
	createTR.href = '/create_tr?id=' + id;
	
	const back = document.getElementById('back');
	back.href = '/main?id=' + id;
	
	
	var querySnapshot = await getTrainingRoomsFilter('rating', 'desc');

	querySnapshot.forEach(doc => {
		putElements(doc);
	});
});


const input = document.getElementById('input');

/**
 * Configuration of name filter.
 *
 * @param {string} name - The training room name.
 * @returns {void}
 * @name search_eventClick
 * @function
 * @memberof trainingRooms
 */
const search = document.getElementById('search');
search.addEventListener('click', async function() {
	if(input.value != ' ') {
		container.innerHTML = "";	
		
		var querySnapshot = await getTrainingRoomsFilter('rating', 'desc');
		querySnapshot.forEach(doc => {
			if(doc.data().name.includes(input.value.toUpperCase())) {
				putElements(doc);
			}
		});
	}
})


/**
 * Configuration of most popular training room filter.
 *
 * @returns {void}
 * @name mostPopular_eventClick
 * @function
 * @memberof trainingRooms
 */
document.getElementById('most-popular').addEventListener('click', async (event) => {
	container.innerHTML = "";
	
	var querySnapshot = await getTrainingRoomsFilter('rating', 'desc');
		querySnapshot.forEach(doc => {
			putElements(doc);
		});
})


/**
 * Configuration of most viewed training room filter.
 *
 * @returns {void}
 * @name mostViewed_eventClick
 * @function
 * @memberof trainingRooms
 */
document.getElementById('most-viewed').addEventListener('click', async (event) => {
	container.innerHTML = "";
	
	var querySnapshot = await getTrainingRoomsFilter('views', 'desc');
		querySnapshot.forEach(doc => {
			putElements(doc);
		});
})


/**
 * Configuration of older training room filter.
 *
 * @returns {void}
 * @name older_eventClick
 * @function
 * @memberof trainingRooms
 */
document.getElementById('older').addEventListener('click', async (event) => {
	container.innerHTML = "";
	
	var querySnapshot = await getTrainingRoomsDate('asc');
		querySnapshot.forEach(doc => {
			putElements(doc);
		});
})

document.getElementById('recently-added').addEventListener('click', async (event) => {
	container.innerHTML = "";
	
	var querySnapshot = await getTrainingRoomsDate('desc');
		querySnapshot.forEach(doc => {
			putElements(doc);
		});
})

/**
 * Instanciate the training rooms present in system.
 *
 * @returns {void}
 * @name putElements
 * @function
 * @memberof trainingRooms
 */
function putElements(doc) {
	const room = document.createElement('a');
	const roomName = document.createElement('p');
	const separator = document.createElement('hr');
	const trainerNameRating = document.createElement('div');
	const trainerName = document.createElement('p');
	const ratingG = document.createElement('span');
	const rating = document.createElement('p');
	const description = document.createElement('p');
	const views = document.createElement('p');

	roomName.textContent = doc.data().name;
	trainerName.textContent = doc.data().trainerName + ' ' + doc.data().trainerLastname;
	description.innerHTML = '<strong>Descripción:</strong> ' + doc.data().description;
	views.textContent = 'Visitas: ' + doc.data().views;
					
	var r = doc.data().rating;
	var string = "";
									
	for(let i=0; i<5-r; i++) {
		ratingG.textContent += '⭐️';
	}
		ratingG.style.filter = 'grayscale(100%)';
				
	for(let i=0; i<r; i++)
		string += '⭐️';
							
	roomName.classList.add('roomName');
	trainerName.classList.add('trainerName');
	rating.classList.add('rating');
	description.classList.add('description');
	views.classList.add('views');

	rating.appendChild(ratingG);
	rating.appendChild(document.createTextNode(string));

	trainerNameRating.appendChild(trainerName);
	trainerNameRating.appendChild(rating);
					
	room.appendChild(roomName);
	room.appendChild(separator);
	trainerNameRating.classList.add('trainerNameRating');
	room.appendChild(trainerNameRating);
	room.appendChild(description);
	room.appendChild(views);
							
	room.classList.add('grid-item');
	room.href = '/specific_tr?userID=' + id + '&roomID=' + doc.data().id;
					
	container.appendChild(room);
}

var options = document.getElementById('options');
var toggleDiv = document.getElementById('toggle-div');

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
