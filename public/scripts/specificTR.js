/**
 * Shows the content of a specific training room.
 * @namespace
 * @name specificTrainingRoom
 */

import { 
	getTrainingRoomID,
	getRoutinesTRID,
	getExercise,
	getExerciseCount,
	currentRoutineStore,
	removeOlderCurrentRoutine,
	addSubscription,
	getSubscription,
	removeSubscription
} from './apiDAO.js';


const userID = document.getElementById('userID').innerHTML;
const roomID = document.getElementById('roomID').innerHTML;

let matE = [];
let matC = [];
let matM = [];
let matS = [];

var container;


/**
 * Initialises training room content.
 *
 * @returns {void}
 * @name eventLoad
 * @function
 * @memberof specificTrainingRoom
 */
window.addEventListener('load', async () => {
	await removeOlderCurrentRoutine(userID);
	
	const back = document.getElementById('back');
	back.href= '/training_rooms?id=' + userID;
	
	var input = document.getElementById('id');
	input.value = userID;
	input = document.getElementById('TRID');
	input.value = roomID;
	
	var roomName, trainerID;
	
	var querySnapshot = await getTrainingRoomID(roomID);
	
	querySnapshot.forEach(doc => {
		roomName = doc.data().name;
		trainerID = doc.data().userID;
	})

	document.getElementById('room-name').innerHTML = roomName;
	
	const sideThing = document.getElementById('side-thing');
	
	if(userID == trainerID) {
		sideThing.classList.add('color1');
		sideThing.innerHTML = "Editar sala";
		sideThing.href = '/edit_tr?userID=' + userID + '&roomID=' + roomID;
		
		var color = true;
		
		setInterval(() => {
			if (color) {
				sideThing.classList.remove('color1');
				sideThing.classList.add('color2');
				color = false;
      			} else {
				sideThing.classList.remove('color2');
				sideThing.classList.add('color1');
				color = true;
			}
		}, 2000);
		
		container = document.getElementById('grid-container');
		const routine = document.createElement('a');
		const add = document.createElement('p');
	
		routine.classList.add('add-routine');
		add.textContent = '+';
		add.classList.add('add-routine');
		routine.classList.add('grid-item');
	
		routine.href = '/make_routine?id=' + userID + '&TR=' + roomID;
		
		routine.appendChild(add);
		container.appendChild(routine);
	}
	else {
		sideThing.classList.add('color2');		
		
		var querySnapshot = await getSubscription(userID, roomID);
		
		if(querySnapshot.docs.length == 0)
			sideThing.innerHTML = "Suscribirse";
		else
			sideThing.innerHTML = "Cancelar suscripción";		
		
		sideThing.addEventListener('click', (event) => {
			if(sideThing.innerHTML == "Suscribirse") {
				addSubscription(userID, roomID);
				sideThing.innerHTML = "Cancelar suscripción";
			}
			else {
				removeSubscription(userID, roomID);
				sideThing.innerHTML = "Suscribirse";
			}
		});
		
		var color = true;
		
		setInterval(() => {
			if (!color) {
				sideThing.classList.remove('color3');
				sideThing.classList.add('color2');
				sideThing.style.color = '#111';
				color = true;
      			} else {
				sideThing.classList.remove('color2');
				sideThing.classList.add('color3');
				sideThing.style.color = 'white';
				color = false;
			}
		}, 3000);
	}
	
	instanciateRoutines();
})


/**
 * Instanciate the routines that belong to the training room.
 *
 * @returns {void}
 * @name instanciateRoutines
 * @function
 * @memberof specificTrainingRoom
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
	
	
	const container = document.getElementById('grid-container');

	let i=0;
	querySnapshot = await getRoutinesTRID(roomID);
	querySnapshot.forEach(doc => {
		name = doc.data().name;
		comment = doc.data().comment;
		exerciseArray = doc.data().exerciseArray;
		counterArray = doc.data().counterArray;
		minutes = doc.data().minutes;
		seconds = doc.data().seconds;
		
		matE.push(exerciseArray);
		matC.push(counterArray);
		matM.push(minutes);
		matS.push(seconds);
		
		const routine = document.createElement('a');
		const routineName = document.createElement('p');
		const separator = document.createElement('hr');
		const description = document.createElement('p');
		const imageER = document.createElement('div');
		const restTime = document.createElement('p');
		
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
		
		routine.appendChild(routineName);
		routine.appendChild(separator);
		routine.appendChild(description);
		routine.appendChild(imageER);
		routine.appendChild(restTime);
		
		routine.id = i + '-routine';
				
		routine.classList.add('grid-item');
		
		container.appendChild(routine);
		
		routine.addEventListener('click', function(event) {
			saveCurrentRoutine(event, container);
		});
		
		i++;
	})
}


/**
 * Save current configurated routine to be execute.
 *
 * @returns {void}
 * @name saveCurrentRoutine
 * @function
 * @memberof specificTrainingRoom
 */
function saveCurrentRoutine(event, container) {
	var routineID = event.currentTarget.id.split('-');

	currentRoutineStore(userID, matE[routineID[0]], matC[routineID[0]], matM[routineID[0]], matS[routineID[0]], container);
}
