/**
 * Initilise PoseNet funcionality.
 * @namespace
 * @name initialisePoseNet
 */

import { 
	getExercise,
	getExerciseCount,
	getCurrentRoutine,
	updateCurrentRoutine
} from './apiDAO.js';


var id = document.getElementById('id').innerHTML;
var userID = document.getElementById('userID');
userID.value = id;

var TR = document.getElementById('TR').innerHTML;
var TRID = document.getElementById('TRID');
TRID.value = TR;

var exercise;	/* Contains exercise parameters list */

/*:::: Routine arrays ::::*/
var exerciseRoutineArray = new Array(50);
var repRoutineArray = new Array(50);
var restMinutes, restSeconds


/**
 * Initialises basic parameters for PoseNet technology.
 *
 * @param {string} id - The user ID.
 * @param {Array} exercise - The exercises array.
 * @param {Array<number>} exerciseRoutineArray - The exercise that routine contains array.
 * @param {Array<number>} repRoutineArray - The repetition array for the exercises.
 * @param {number} restMinutes - Rest minutes.
 * @param {number} restSeconds - Rest seconds.
 * @returns {void}
 * @name eventLoad
 * @function
 * @memberof initialisePoseNet
 */
window.addEventListener('DOMContentLoaded', async () => {
	var backButton = document.getElementById('back');
	
	if(TR == 0)
		backButton.href = '/main?id=' + id;
	else
		backButton.href = '/specific_tr?userID=' + id + '&roomID=' + TR;
	
	var querySnapshot = await getCurrentRoutine(id);

	querySnapshot.forEach(doc => {
		exerciseRoutineArray = doc.data().exerciseArray;
		repRoutineArray = doc.data().counterArray;
		restMinutes = doc.data().minutes;
		restSeconds = doc.data().seconds;
	});

	/* Get exercises count from the Firebase database */
	const exerciseNum = await getExerciseCount();
	exercise = new Array(exerciseNum);
	
	/* Get exercise parameters from the Firebase database */
	querySnapshot = await getExercise();
	
	querySnapshot.forEach(doc => {
		exercise.push([
			doc.data().id,
			doc.data().name,
			doc.data().RKeyPoint1,
			doc.data().RKeyPoint2,
			doc.data().LKeyPoint1,
			doc.data().LKeyPoint2,
			doc.data().upperAngleMin,
			doc.data().upperAngleMax,
			doc.data().lowerAngleMin,
			doc.data().lowerAngleMax,
			doc.data().imageURL
		]);
	});
	
	/* Slice redundant data */
	exercise = exercise.slice(1);
	
	setupParameters(id, exercise, exerciseRoutineArray, repRoutineArray, restMinutes, restSeconds, updateCurrentRoutine);
});
