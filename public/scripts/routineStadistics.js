/**
 * Parses and shows the stadistics of the performed routine.
 * @namespace
 * @name routineStadistics
 */

import { 
	getCurrentRoutine,
	getExercise,
	getExerciseCount,
	getLastRoutineId,
	storeRoutines,
	getUserID,
	updateRating,
	storeRoutineHistory,
	addMensualStadistics,
	updateMensualStadistics,
	getMensualStadistics,
	updateUserActivity,
} from './apiDAO.js';


var exercise, muscleGroup;
var personalEvaluation;
var weight;

var idA = document.getElementById('id').innerHTML;
var userID = document.getElementById('userID');
userID.value = idA;

var TR = document.getElementById('TR').innerHTML;
var TRID = document.getElementById('TRID');
TRID.value = TR;

var exerciseCompleted, repCompleted, minutesWork, secondsWork, restMinutes, restSeconds;

var troncoAnterior = 0, troncoPosterior = 0, brazos = 0, piernas = 0;


/**
 * Initialises parameters obtained from the performed routine.
 *
 * @param {Array} exercise - The exercises array.
 * @param {Array<number>} exerciseCompleted - The performed exercises array.
 * @param {Array<counterArrayPs>} repCompleted - The performed repetitions array.
 * @param {number} minutesWork - Worked minutes.
 * @param {number} secondsWork - Worked seconds.
 * @param {number} restMinutes - Rest minutes.
 * @param {number} restSeconds - Rest seconds.
 * @returns {void}
 * @name eventLoad
 * @function
 * @memberof routineStadistics
 */
window.addEventListener("load", async (event) => {
	var querySnapshot = await getUserID(idA);
	
	const back = document.getElementById('back');
	back.href = '/main?id=' + idA;
	
	querySnapshot.forEach(doc => {
		weight = doc.data().weight;
	});
			
	const e1 = document.getElementById("e-1");
	e1.style.backgroundColor = "#FFC300";
	e1.style.color = "#111";
	
	personalEvaluation = 1;
	
	/* Get exercises count from the Firebase database */
	const exerciseNum = await getExerciseCount();
	exercise = new Array(exerciseNum);
	muscleGroup = new Array(exerciseNum);
	
	/* Get exercise parameters from the Firebase database */
	querySnapshot = await getExercise();
	
	querySnapshot.forEach(doc => {
		exercise.push([
			doc.data().name
		]);
		
		muscleGroup.push([
			doc.data().muscleGroup
		]);
	});
	
	exercise = exercise.slice(1);
	muscleGroup = muscleGroup.slice(1);

	querySnapshot = await getCurrentRoutine(idA);
	querySnapshot.forEach(doc => {
		exerciseCompleted = doc.data().exerciseCompleted;
		repCompleted = doc.data().repCompleted;
		minutesWork = doc.data().minutesWork;
		secondsWork = doc.data().secondsWork;
		restMinutes = doc.data().minutes;
		restSeconds = doc.data().seconds;
	});
	
	
	var workTimeMinutes=0, workTimeSeconds=0;
	var restTimeMinutes=0, restTimeSeconds=0;
	var totalTimeMinutes=0, totalTimeSeconds=0;
	
	const table = document.getElementById('myTable');
	
	for(let i=0; i<exerciseCompleted.length; i++) {
		if(repCompleted[i] != 0) {
			const row = document.createElement('tr');
		
			var cell = document.createElement('td');
			cell.textContent = exercise[exerciseCompleted[i]];
			row.appendChild(cell);
			
			cell = document.createElement('td');
			cell.textContent = repCompleted[i];
			row.appendChild(cell);
							
			cell = document.createElement('td');
			cell.textContent = minutesWork[i] + 'min ' + secondsWork[i] + 'seg';
			row.appendChild(cell);
			
			table.appendChild(row);
			
			
			workTimeMinutes += parseInt(minutesWork[i]);
			workTimeSeconds += parseInt(secondsWork[i]);
			
			if(i != exerciseCompleted.length - 1) {
				restTimeMinutes += parseInt(restMinutes);
				restTimeSeconds += parseInt(restSeconds);
			}
			
			if(muscleGroup[exerciseCompleted[i]] == 'tronco anterior')
				troncoAnterior += repCompleted[i];
			if(muscleGroup[exerciseCompleted[i]] == 'tronco posterior')
				troncoPosterior += repCompleted[i];
			if(muscleGroup[exerciseCompleted[i]] == 'brazos')
				brazos += repCompleted[i];
			if(muscleGroup[exerciseCompleted[i]] == 'piernas')
				piernas += repCompleted[i];
		}
	}
	
	if(workTimeSeconds >= 60) {
		workTimeMinutes += Math.floor(workTimeSeconds / 60);
		workTimeSeconds = workTimeSeconds % 60;
	}
	var e = document.getElementById('workTime');
	e.innerHTML += ' ' + workTimeMinutes + 'min ' + workTimeSeconds + 'seg';
	
	if(restTimeSeconds >= 60) {
		restTimeMinutes += Math.floor(restTimeSeconds / 60);
		restTimeSeconds = restTimeSeconds % 60;
	}
	e = document.getElementById('restTime');
	e.innerHTML += ' ' + restTimeMinutes + 'min ' + restTimeSeconds + 'seg';
	
	totalTimeMinutes = workTimeMinutes + restTimeMinutes;
	totalTimeSeconds = workTimeSeconds + restTimeSeconds;
	
	if(totalTimeSeconds > 60) {
		totalTimeMinutes += Math.floor(totalTimeSeconds / 60);
		totalTimeSeconds = totalTimeSeconds % 60;
	}
	e = document.getElementById('totalTime');
	e.innerHTML += ' ' + totalTimeMinutes + 'min ' + totalTimeSeconds + 'seg';
	
	
	var totalTimeHours, totalSeconds;
	totalSeconds = (totalTimeMinutes * 60) + totalTimeSeconds;
	totalTimeHours = totalSeconds / 3600;
	
	var burnedCalories = weight * totalTimeHours * 7.5;
	
	document.getElementById('burned-calories').innerHTML += ' ' + burnedCalories.toFixed(1) + ' calorias';
	
	
	storeRoutineHistory(idA, exerciseCompleted, repCompleted, restMinutes, restSeconds);
	
	
	var routines, newRoutines;
	var trainingTime, nTT, nTTt, cTT;
	var newTrainingTime, completionDate;
	
	
	querySnapshot = await getUserID(idA);
	
	querySnapshot.forEach(doc => {
		routines = doc.data().routines;
		trainingTime = doc.data().trainingTime;
		nTT = doc.data().id;	
	});	
		
	if(typeof routines == 'undefined' || typeof trainingTime == 'undefined') {
		newRoutines = 1;
		newTrainingTime = '00:' + totalTimeMinutes + ':' + totalTimeSeconds;
		
		updateUserActivity(idA, newRoutines, newTrainingTime, (totalTimeMinutes*60+totalTimeSeconds), troncoAnterior, troncoPosterior, brazos, piernas);
	}
	else {
		newRoutines = routines + 1;
		
		nTT = trainingTime.split(':');
		nTTt = parseInt(nTT[0]) * 3600 + parseInt(nTT[1]) * 60 + parseInt(nTT[2]);
		cTT = totalTimeMinutes * 60 + totalTimeSeconds;
		
		nTT = parseInt(nTTt) + parseInt(cTT);
		newTrainingTime = timeFormat(parseInt(nTT));
		
		updateUserActivity(idA, newRoutines, newTrainingTime, (totalTimeMinutes*60+totalTimeSeconds), troncoAnterior, troncoPosterior, brazos, piernas);
	}
	
	var routines2, trainingTime2, day;
	
	querySnapshot = await getMensualStadistics(idA);
	
	querySnapshot.forEach(doc => {
		routines2 = doc.data().routines;
		trainingTime2 = doc.data().trainingTime;
		completionDate = doc.data().completionDate;
		day = doc.data().day;
	});
	
	const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

	const today = new Date();
	const dayOfWeek = daysOfWeek[today.getDay()];
	
	const date = new Date();
	const dayOfMonth = date.getDate();

	if(typeof routines2 == 'undefined' || typeof trainingTime2 == 'undefined' || dayOfWeek != day) {
		newRoutines = 1;
		newTrainingTime = '00:' + totalTimeMinutes + ':' + totalTimeSeconds;
		
		addMensualStadistics(idA, newRoutines, newTrainingTime, new Date().getTime(), dayOfWeek, dayOfMonth, burnedCalories.toFixed(1), totalTimeMinutes)
	}
	else {
		newRoutines = routines2 + 1;
		
		nTT = trainingTime2.split(':');
		nTTt = parseInt(nTT[0]) * 3600 + parseInt(nTT[1]) * 60 + parseInt(nTT[2]);
		cTT = totalTimeMinutes * 60 + totalTimeSeconds;
		
		nTT = parseInt(nTTt) + parseInt(cTT);
		newTrainingTime = timeFormat(parseInt(nTT));
		
		var currentDate =  new Date().getTime();
		
		if(completionDate < currentDate - 86400000 /*One day milliseconds*/) {
			newRoutines = 1;
			newTrainingTime = '00:' + totalTimeMinutes + ':' + totalTimeSeconds;
			addMensualStadistics(idA, newRoutines, newTrainingTime, new Date().getTime(), dayOfWeek, dayOfMonth, burnedCalories.toFixed(1), totalTimeMinutes);
		} else
			updateMensualStadistics(idA, newRoutines, newTrainingTime, new Date().getTime() - 86400000 /*One day milliseconds*/, new Date().getTime(), dayOfMonth, burnedCalories.toFixed(1), totalTimeMinutes);
	}
})

function timeFormat(seconds) {
  var hours = Math.floor(seconds / 3600);
  var minutes = Math.floor((seconds - (hours * 3600)) / 60);
  var restSeconds = seconds - (hours * 3600) - (minutes * 60);

  if (hours < 10) {hours = "0" + hours;}
  if (minutes < 10) {minutes = "0" + minutes;}
  if (restSeconds < 10) {restSeconds = "0" + restSeconds;}

  var formattedTime = hours + ':' + minutes + ':' + restSeconds;

  return formattedTime;
}

var e1 = document.getElementById("e-1");
e1.addEventListener("click", (event) => {
	for(let i=1; i<=5; i++) {
		const e = document.getElementById("e-" + i);
		e.style.backgroundColor = "#e7e7e7";
	}
	
	e1.style.backgroundColor = "#FFC300";
	e1.style.color = "#111";
	
	personalEvaluation = 1;
})

var e2 = document.getElementById("e-2");
e2.addEventListener("click", (event) => {
	for(let i=1; i<=5; i++) {
		const e = document.getElementById("e-" + i);
		e.style.backgroundColor = "#e7e7e7";
	}
	
	e2.style.backgroundColor = "#FFC300";
	e2.style.color = "#111";
	
	personalEvaluation = 2;
})

var e3 = document.getElementById("e-3");
e3.addEventListener("click", (event) => {
	for(let i=1; i<=5; i++) {
		const e = document.getElementById("e-" + i);
		e.style.backgroundColor = "#e7e7e7";
	}
	
	e3.style.backgroundColor = "#FFC300";
	e3.style.color = "#111";
	
	personalEvaluation = 3;
})

var e4 = document.getElementById("e-4");
e4.addEventListener("click", (event) => {
	for(let i=1; i<=5; i++) {
		const e = document.getElementById("e-" + i);
		e.style.backgroundColor = "#e7e7e7";
	}
	
	e4.style.backgroundColor = "#FFC300";
	e4.style.color = "#111";
	
	personalEvaluation = 4;
})

var e5 = document.getElementById("e-5");
e5.addEventListener("click", (event) => {
	for(let i=1; i<=5; i++) {
		const e = document.getElementById("e-" + i);
		e.style.backgroundColor = "#e7e7e7";
	}
	
	e5.style.backgroundColor = "#FFC300";
	e5.style.color = "#111";
	
	personalEvaluation = 5;
})


var exerciseCompleted, repCompleted;
var minutesWork, secondsWork;
var restMinutes, restSeconds;

const button = document.getElementById('back-button');


/**
 * Save the performed routine.
 *
 * @param {string} id - The user ID.
 * @param {Array<number>} exerciseCompleted - The performed exercises array.
 * @param {Array<number>} repCompleted - The performed repetitions array.
 * @param {number} restMinutes - Rest minutes.
 * @param {number} restSeconds - Rest seconds.
 * @param {number} personalData - The personal evaluation of the performed routine.
 * @returns {void}
 * @name saveRoutine_eventClick
 * @function
 * @memberof routineStadistics
 */
document.getElementById('save-routine').addEventListener('click', async (event) => {
	var conti = true;
	const nameI = document.getElementById('name');
	const commentI = document.getElementById('comment');
	const message = document.getElementById('message');
	
	if(nameI.value == '' || nameI.value == ' ') {
		message.innerHTML = "Introduzca un nombre válido antes de guardar la rutina";
		conti = false;
	}	
		
	setTimeout(function() {
		message.innerHTML = "";
	}, 3000);
	
	
	if(conti) {
		button.disabled = true;
		
		if(commentI.value.length == 0) commentI.value = ' ';
		
		var id;
		const querySnapshot = await getLastRoutineId(idA);
		querySnapshot.forEach((doc) => {
			id = doc.data().routineID;
		});
			
		if(typeof id == "undefined") id = 0;
		else id++;
			
		/* Store current routine data */
		storeRoutines(id, nameI.value, commentI.value, idA, exerciseCompleted, repCompleted, restMinutes, restSeconds, personalEvaluation, button);
		
		message.innerHTML = "La rutina ha sido almacenada en la biblioteca";
	}
});

button.addEventListener('click', (event) => {
	if(TRID.value != 0) {
		event.preventDefault();
		
		const form = document.getElementById('form')
		updateRating(TRID.value, personalEvaluation, form);
	}
})

