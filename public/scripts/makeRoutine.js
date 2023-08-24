/**
 * Build routines file.
 * @namespace
 * @name makeRoutines
 */

import { 
	getUserID,
	getExercise,
	getExerciseCount,
	currentRoutineStore,
	removeOlderCurrentRoutine,
	getLastRoutineId,
	storeRoutines,
	getLastRoutineTRId,
	storeRoutinesTR
} from './apiDAO.js';

const idA = document.getElementById('id').innerHTML;
const TR = document.getElementById('TR').innerHTML;

var exercise;		/* Contains exercise parameters */

/*:::: Action of the routine construcction buttons ::::*/
var exerciseRoutineArray = new Array(50);
var repRoutineArray = new Array(50);
var sealingExerciseArray = new Array(50);
var counterAux;


/**
 * Initializes basic data for the routines construction.
 *
 * @returns {void}
 * @name eventLoad
 * @function
 * @memberof makeRoutines
 */
window.addEventListener('DOMContentLoaded', async () => {	
	
	const back = document.getElementById('back');
	back.href = '/main?id=' + idA;
	
	await removeOlderCurrentRoutine(idA);
	
	/* Get exercises count from the Firebase database */
	const exerciseNum = await getExerciseCount();
	exercise = new Array(exerciseNum);
	
	/* Get exercise parameters from the Firebase database */
	const querySnapshot = await getExercise();
	
	querySnapshot.forEach(doc => {
		exercise.push([
			doc.data().id,
			doc.data().name,
			doc.data().imageURL
		]);
	});
	
	exercise = exercise.slice(1);
		
	
	/* Inicialize routine control arrays */
	for(var i=0; i<repRoutineArray.length; i++) {
		exerciseRoutineArray[i] = -1;
		repRoutineArray[i] = 0;
		sealingExerciseArray[i] = 0;
	}
	
	cloneExercises();
});


/**
 * Initializes the routine construction panle and set the avaible exercises.
 *
 * @param {Array} exercise - Exercises
 * @returns {void}
 * @name cloneExercises
 * @function
 * @memberof makeRoutines
 */
function cloneExercises() {
	var node, clone, iterator = 0;

	for(var i=0; i<exercise.length-1; i++) {
		node = document.getElementById("exercise_container");
		clone = node.cloneNode(true);
		document.getElementById("all_exercise_container").appendChild(clone);
	}

	document.querySelectorAll("#exercise_image").forEach((element) => {
		element.src = "../VisualFiles/" + exercise[iterator][2];

		iterator++;
	});

	iterator = 0;
	document.querySelectorAll("#exercise_type").forEach((element) => {
		element.innerHTML = exercise[iterator][1];

		iterator++;
	});

	iterator = 0;
	document.querySelectorAll("#add_rep_button_0").forEach((element) => {
		var changeIdButton = element.id.split('_');;
		changeIdButton[3] = exercise[iterator][0];

		element.id = changeIdButton [0] + '_' + changeIdButton [1] + '_' + changeIdButton [2] + '_' + changeIdButton [3];
		element.addEventListener('click', function(event) {
			controlReps(event);
		});
		iterator++;
	});

	iterator = 0;
	document.querySelectorAll("#subtract_rep_button_0").forEach((element) => {
		var changeIdButton = element.id.split('_');
		changeIdButton[3] = exercise[iterator][0];

		element.id = changeIdButton [0] + '_' + changeIdButton [1] + '_' + changeIdButton [2] + '_' + changeIdButton [3];
		element.addEventListener('click', function(event) {
			controlReps(event);
		});
		iterator++;
	});

	iterator = 0;
	document.querySelectorAll("#sealing_exercise_0").forEach((element) => {
		var changeIdButton = element.id.split('_');;
		changeIdButton[2] = exercise[iterator][0];

		element.id = changeIdButton [0] + '_' + changeIdButton [1] + '_' + changeIdButton [2];
		element.addEventListener('click', function(event) {
			sealingExercise(event);
		});
		iterator++;
	});
}


/*:::: Update the data of current routine box ::::*/
var box = document.querySelector("#current_routine");


/**
 * Controls the increase and decrease of the repetitions of the exercises.
 *
 * @returns {void}
 * @name controlReps
 * @function
 * @memberof makeRoutines
 */
function controlReps(event) {
	var iterator, exerciseRoutineCounter = 0;
	var buttonId = event.target.id.split('_');
	
	/* Check where to add or subtract the exercise */
	for(var i=0; i<exerciseRoutineArray.length; i++) {
		if((exerciseRoutineArray[i] == buttonId[3] && sealingExerciseArray[i] == 0) || exerciseRoutineArray[i] == -1) {
			exerciseRoutineArray[exerciseRoutineCounter] = buttonId[3];
			i = exerciseRoutineArray.length;
		}
		else
			exerciseRoutineCounter++;
	}
	
	/* Add rep counter button funcionality */
	if(buttonId[0] == 'add') {
		if(repRoutineArray[exerciseRoutineCounter] < 99)
			repRoutineArray[exerciseRoutineCounter]++;
		
		iterator = 0;
		document.querySelectorAll("#num_rep").forEach((element) => {
      		if(iterator == exerciseRoutineArray[exerciseRoutineCounter])
				element.innerHTML = repRoutineArray[exerciseRoutineCounter];
			iterator++;
    	});	
	}
	
	/* Subtract rep counter button funcionality */
	if(buttonId[0] == 'subtract' && repRoutineArray[exerciseRoutineCounter] > 0) {
		repRoutineArray[exerciseRoutineCounter]--;
				
		iterator = 0;
		document.querySelectorAll("#num_rep").forEach((element) => {
      			if(iterator == exerciseRoutineArray[exerciseRoutineCounter])
				element.innerHTML = repRoutineArray[exerciseRoutineCounter];
			iterator++;
    		});
		
		counterAux = exerciseRoutineCounter;
		if(repRoutineArray[exerciseRoutineCounter] <= 0) {
			exerciseRoutineArray[exerciseRoutineCounter] = -1;

			while(exerciseRoutineArray[counterAux + 1] != -1) {
				exerciseRoutineArray[counterAux] = exerciseRoutineArray[counterAux + 1];
				repRoutineArray[counterAux] = repRoutineArray[counterAux + 1];
				counterAux++;
			}
		
			exerciseRoutineArray[counterAux] = -1;
			repRoutineArray[counterAux] = 0;
		}
	}
	

	if(repRoutineArray[exerciseRoutineCounter] == 0)
		exerciseRoutineArray[exerciseRoutineCounter] = -1;
		
	box.innerHTML= "";
//console.log(exerciseRoutineArray, repRoutineArray);
	iterator = 0;
	while(exerciseRoutineArray[iterator] != -1) {
		if(iterator == 0)
			box.innerHTML = repRoutineArray[iterator] + "x " + exercise[exerciseRoutineArray[iterator]][1] + "<br>";	
		else
			box.innerHTML = box.innerHTML + repRoutineArray[iterator] + "x " + exercise[exerciseRoutineArray[iterator]][1] + "<br>";	
		iterator++;
	}
}


/*:::: Sealing button funcionality ::::*/
/**
 * Contols the sealed of the exercises.
 *
 * @returns {void}
 * @name sealingExercise
 * @function
 * @memberof makeRoutines
 */
function sealingExercise(event) {
	var iterator;
	var buttonId = event.target.id.split('_');

	for(var i=0; i<exerciseRoutineArray.length; i++) {
		if(buttonId[2] == exerciseRoutineArray[i] && sealingExerciseArray[i] == 0)
			sealingExerciseArray[i] = 1;
	}

	iterator = 0;
	document.querySelectorAll("#num_rep").forEach((element) => {
		if(iterator == buttonId[2])
			element.innerHTML = "0";
		iterator++;
    });
}


/*:::: Start routine  ::::*/
var contAux = 0;
const startButton = document.getElementById('start-button');
var startButton2 = null;
var routineForm = null;
var saveButton = null;
var TR_button = null;


/**
 * Completion of the configuration of exercises. Give way to the indiation of rest time.
 *
 * @returns {void}
 * @name startButton_eventClick
 * @function
 * @memberof makeRoutines
 */
startButton.addEventListener('click', function(event) {
	for(var i=0; i<50; i++) {
		if(exerciseRoutineArray[i] != -1)
			contAux++;
	}

	if(contAux == 0)
		return;
	if(contAux == 1) {
		if(TR == 0) {
			routineForm = document.getElementById('routine-form');
			start_routine_function();
			return;
		}
	}
		
	
	document.querySelector(".build_routine").remove();

	document.getElementById("add_rest_time").innerHTML = `
		<div class="container">

  
		  <form id="routine-form2" method="POST">
    
    		<div class="group">      
		      <label>Minutos</label>
		      <input id="rest_time_minutes" class="range" type="range" min="0" max="10" value="0" required>
		      <p id="minutes-number" class="range-number">0</p>
		    </div>
      
  		  <div class="group">      
		      <label>Segundos</label>
		      <input id="rest_time_seconds" class="range" type="range" min="0" max="60" value="0" style="margin-bottom:35px;" required>
		      <p id="seconds-number" class="range-number" style="margin-top:-67px;">0</p>
	  	  </div>

	    	<button type="submit" id="start-button2" class="start_routine_button">Comenzar rutina</button>
	    	
	    	
	    	<label id="nameL" for="name">Nombre de la rutina</label>
			<input type="text" id="name" name="name">
		
			<label for="comment">Comentario</label>
			<textarea id="comment" name="comment"></textarea>
	  	
	  		<input id="userID" name="userID" hidden></input>
	  		<input id="TRID" name="TRID" hidden></input>
	  	  	
	  		<p id="message"></p>	
	  			    		   	  
	   		 <button id="save-routine" return false>Guardar Rutina</button>
	   	 
	   		 <button type="submit" id="TR-button" class=" start_routine_button" style="font-size:30px;">Hecho</button>
	   	     
	  	</form>  	
	  	</div>`;
		
	startButton2 = document.getElementById('start-button2');
	routineForm = document.getElementById('routine-form2');
	
	TR_button = document.getElementById('TR-button');
		
	if(TR != 0) {
		startButton2.remove();
		TR_button.addEventListener('click', function(event) {
			event.preventDefault();
			TR_routine();
		})
	}
	else {
		TR_button.remove();
		startButton2.addEventListener('click', function(event) {
			event.preventDefault();
			start_routine_function();
		});
	}
	
	document.getElementById('rest_time_minutes').addEventListener('input', minutesChange, false);
	
	document.getElementById('rest_time_seconds').addEventListener('input', secondsChange, false);
	
	saveButton = document.getElementById('save-routine');
	saveButton.addEventListener('click', saveRoutine, false);
	
	
});


function minutesChange() {
	var range_number = document.getElementById('minutes-number');
	range_number.innerHTML = document.getElementById('rest_time_minutes').value;
}

function secondsChange() {
	var range_number = document.getElementById('seconds-number');
	range_number.innerHTML = document.getElementById('rest_time_seconds').value;
}


/**
 * Completion of routine construction and configuration for execution.
 *
 * @returns {void}
 * @name start_routine_function
 * @function
 * @memberof makeRoutines
 */
function start_routine_function() {
	const userID = document.getElementById('userID');
	userID.value = idA;
	const TRID = document.getElementById('TRID');
	TRID.value = TR;

	var restTimeMinutes, restTimeSeconds;
	
	if(contAux == 1) {
		restTimeMinutes = 0;
		restTimeSeconds = 0;
	}
	
	if(contAux > 1) {
		restTimeMinutes = document.getElementById("rest_time_minutes").value;
		restTimeSeconds = document.getElementById("rest_time_seconds").value;

		if(restTimeMinutes == "") restTimeMinutes = 0;
	}
	
	/* Store current routine data */
	currentRoutineStore(idA, exerciseRoutineArray, repRoutineArray, restTimeMinutes, restTimeSeconds, routineForm);
}


/**
 * Save the configurated routine.
 *
 * @returns {void}
 * @param {Object}
 * @name saveRoutine
 * @function
 * @memberof makeRoutines
 */
async function saveRoutine(event) {
	event.preventDefault();
	
	var conti = true, personalEvaluation;
	const nameI = document.getElementById('name');
	const commentI = document.getElementById('comment');
	const message = document.getElementById('message');
	
	if(nameI.value == '' || nameI.value == ' ') {
		message.innerHTML = "Introduzca un nombre v&aacute;lido antes de guardar la rutina";
		conti = false;
	}
		
	setTimeout(function() {
		message.innerHTML = "";
	}, 3000);
	
	if(conti) {
		var restTimeMinutes, restTimeSeconds;
		
		if(contAux == 1) {
			restTimeMinutes = 0;
			restTimeSeconds = 0;
		}
		
		if(contAux > 1) {
			restTimeMinutes = document.getElementById("rest_time_minutes").value;
			restTimeSeconds = document.getElementById("rest_time_seconds").value;

			if(restTimeMinutes == "") restTimeMinutes = 0;
		}
		
		startButton2.disabled = true;
		
		var id;
		const querySnapshot = await getLastRoutineId(idA);
		querySnapshot.forEach((doc) => {
			id = doc.data().id;
		});
			
		if(typeof id == "undefined") id = 0;
		else id++;
			
		if(commentI.value.length == 0) commentI.value = ' ';
		personalEvaluation = 0;
		/* Store current routine data */
		storeRoutines(id, nameI.value, commentI.value, idA, exerciseRoutineArray, repRoutineArray, restTimeMinutes, restTimeSeconds, personalEvaluation, startButton2);
		
		message.innerHTML = "La rutina ha sido almacenada";
		
		setTimeout(function() {
			message.innerHTML = "";
		}, 3000);
	}
}


/**
 * Configure the training room for which the routine was built, if applicable .
 *
 * @returns {void}
 * @name TR_routine
 * @function
 * @memberof makeRoutines
 */
async function TR_routine() {
	var routineID;
	const querySnapshot = await getLastRoutineTRId(TR);
	querySnapshot.forEach((doc) => {
		routineID = doc.data().routineID;
	});
			
	if(typeof routineID == "undefined") routineID = 0;
	else routineID++;
	
	const nameI = document.getElementById('name');
	const commentI = document.getElementById('comment');
	const message = document.getElementById('message');
	
	if(nameI.value == '' || nameI.value == ' ') {
		message.innerHTML = "Introduzca un nombre v&aacute;lido antes de guardar la rutina";
	}
	else {
		const userID = document.getElementById('userID');
		userID.value = idA;
		const TRID = document.getElementById('TRID');
		TRID.value = TR;

		var restTimeMinutes, restTimeSeconds;
		
		if(contAux == 1) {
			restTimeMinutes = 0;
			restTimeSeconds = 0;
		}
		
		if(contAux > 1) {
			restTimeMinutes = document.getElementById("rest_time_minutes").value;
			restTimeSeconds = document.getElementById("rest_time_seconds").value;

			if(restTimeMinutes == "") restTimeMinutes = 0;
		}
		
		/* Store current routine data */
		storeRoutinesTR(routineID, TR, nameI.value, commentI.value, exerciseRoutineArray, repRoutineArray, restTimeMinutes, restTimeSeconds, routineForm);
	}
}
