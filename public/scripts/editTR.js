/**
 * Edit training room file.
 * @namespace
 * @name editTrainingRoom
 */

import { 
	getTrainingRoomID,
	getExerciseCount,
	getExercise,
	getRoutinesTRID,
	removeRoutine,
	removeRoom,
	updateTR
} from './apiDAO.js';


const userID = document.getElementById('userID').innerHTML;
const roomID = document.getElementById('roomID').innerHTML;

const id = document.getElementById('id');
id.value = userID;

let matID = [];

const nameI = document.getElementById('name');
const commentI = document.getElementById('comment');

var container = document.getElementById('grid-container');;


/**
 * Initializes the basic elements of editing a training room.
 *
 * @returns {void}
 * @name eventLoad
 * @function
 * @memberof editTrainingRoom
 */
window.addEventListener('load', async () => {
	const back = document.getElementById('back');
	back.href = '/specific_tr?userID=' + userID + '&roomID=' + roomID;
	
	var roomName, comment;
	
	const querySnapshot = await getTrainingRoomID(roomID);
	
	querySnapshot.forEach(doc => {
		roomName = doc.data().name;
		comment = doc.data().description;
	})
	
	nameI.value = roomName;
	commentI.value = comment;

	document.getElementById('room-name').innerHTML = roomName;
	
	const sideThing = document.getElementById('side-thing');
	sideThing.style.backgroundColor = '#C0C0C0';
	sideThing.addEventListener('click', (event) => {
		updateTR(roomID, nameI.value, commentI.value, userID);
	});
		
	instanciateRoutines();
})

/**
 * Initializes the routines contained in the training room.
 *
 * @param {string} name - The routine name.
 * @param {string} comment - The routine description.
 * @param {Array<number>} exerciseArray - The routine exercises.
 * @param {Array<number>} counterArray - The routine exercises repetitions.
 * @param {number} minutes - The routine rest minutes.
 * @param {number} seconds - The routine rest seconds.
 * @param {string} roomID - The training room ID.
 * @returns {void}
 * @name instanciateRoutines
 * @function
 * @memberof editTrainingRoom
 */
async function instanciateRoutines() {
	var name, comment, exerciseArray, counterArray, minutes, seconds;
	
	/* Get exercises count from the Firebase database */
	const exerciseNum = await getExerciseCount();
	var exercise = new Array(exerciseNum);
	
	/* Get exercise parameters from the Firebase database */
	var querySnapshot = await getExercise();
	
	querySnapshot.forEach(doc => {
		exercise.push([
			doc.data().name,
			doc.data().imageURL
		]);
	});
	
	exercise = exercise.slice(1);

	let i=0;
	querySnapshot = await getRoutinesTRID(roomID);
	querySnapshot.forEach(doc => {
		name = doc.data().name;
		comment = doc.data().comment;
		exerciseArray = doc.data().exerciseArray;
		counterArray = doc.data().counterArray;
		minutes = doc.data().minutes;
		seconds = doc.data().seconds;
		
		matID.push(doc.data().routineID);
		
		const routine = document.createElement('a');
		const routineContent = document.createElement('div');
		const routineName = document.createElement('p');
		const separator = document.createElement('hr');
		const description = document.createElement('p');
		const imageER = document.createElement('div');
		const restTime = document.createElement('p');
		const RMbutton = document.createElement('a');
		
		routineContent.classList.add('routine-content');
		RMbutton.classList.add('rm-button');
		RMbutton.textContent = '✕';
		RMbutton.style.visibility = 'hidden';
		
		imageER.id = 'imageER';
				
		for(let i=0; i<exerciseArray.length; i++) {
			if(exerciseArray[i] != -1) {
				const c = document.createElement('div');
				const img = document.createElement('img');
				img.src = "../VisualFiles/" + exercise[exerciseArray[i]][1];
				const rep = document.createElement('p');
				rep.textContent = counterArray[i] + 'x ' + exercise[exerciseArray[i]][0];
				
				rep.id = 'rep';
				
				c.appendChild(img);
				c.appendChild(rep);
				
				imageER.appendChild(c);
			}
			else
				i = exerciseArray.length;
		}
		
		routineName.textContent = name;
		description.innerHTML = '<strong>Descripción:</strong>' + ' ' + comment;
		restTime.textContent = 'Descanso: ' + minutes + 'min ' + seconds + 'seg';
		
		routineName.classList.add('roomName');
		description.classList.add('description');
		restTime.classList.add('restTime');
		
		routineContent.appendChild(routineName);
		routineContent.appendChild(separator);
		routineContent.appendChild(description);
		routineContent.appendChild(imageER);
		routineContent.appendChild(restTime);
		
		routine.appendChild(routineContent);
		routine.appendChild(RMbutton);
				
		routine.id = i + '-routine';
				
		routine.classList.add('grid-item');
		
		container.appendChild(routine);
		
		routine.addEventListener('mouseenter', function(event) {
			RMbutton.style.visibility = 'visible';
			RMbutton.style.opacity = 0;
			
			var opacity = 0;
			var temp = setInterval(function() {
				if (opacity < 0.85) {
					opacity += 0.3;
					RMbutton.style.opacity = opacity;
				} else {
					clearInterval(temp);
				}
			}, 50);
		});
		
		routine.addEventListener('mouseleave', function(event) {
			var opacity = RMbutton.style.opacity;
			var temp = setInterval(function() {
				if (opacity > 0.15) {
					opacity -= 0.3;
					RMbutton.style.opacity = opacity;
				} else {
					clearInterval(temp);
					RMbutton.style.visibility = 'hidden';
				}
			}, 50);

		});
		
		routine.addEventListener('click', function(event) {
			const e = document.getElementById(event.currentTarget.id);
			e.style.display = 'none';
			
			const id = event.currentTarget.id.split('-');
			const routineID = matID[id[0]];
			removeRoutine(roomID, routineID);
		});
		
		i++;
	})
}


/**
 * Delete training room.
 *
 * @param {string} roomID - The training room ID.
 * @returns {void}
 * @name removeRoom_eventClick
 * @function
 * @memberof editTrainingRoom
 */
const rmRoom = document.getElementById('remove-room');
rmRoom.addEventListener('click', function(event) {
	event.preventDefault();
	
	if(rmRoom.innerHTML == "Eliminar sala") {
		rmRoom.innerHTML = "⚠️ Confirmar";
	}
	else {
		const form = document.getElementById('form');
		removeRoom(roomID, form);
	}
})
