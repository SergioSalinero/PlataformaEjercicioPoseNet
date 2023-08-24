/**
 * Personal routines file.
 * @namespace
 * @name myRoutines
 */

import { 
	getRoutineHistory,
	getStoredRoutines,
	getExercise,
	getExerciseCount,
	currentRoutineStore,
	removeOlderCurrentRoutine
} from './apiDAO.js';


var tabControl = document.querySelector('.tabcontrol');
var tabLinks = tabControl.querySelectorAll('a');
var tabUnderline = tabControl.querySelector('.underline');

const id = document.getElementById('id').innerHTML;

markActiveTab(tabLinks[0]);

var name, comment, exerciseArray, counterArray, minutes, seconds;

let matEH = [];
let matCH = [];
let matMH = [];
let matSH = [];

let matNS = [];
let matDS = [];
let matES = [];
let matCS = [];
let matMS = [];
let matSS = [];
let matPS = [];

var exercise;

const container = document.getElementById('grid-container');


/**
 * Initialises basic parameters and the routines saved and performed.
 *
 * @param {string} id - The user ID.
 * @returns {void}
 * @name eventLoad
 * @function
 * @memberof myRoutines
 */
window.addEventListener('load', async function(event) {
	await removeOlderCurrentRoutine(id);

	const back = document.getElementById('back');
	back.href = '/main?id=' + id;

	/* Get exercises count from the Firebase database */
	const exerciseNum = await getExerciseCount();
	exercise = new Array(exerciseNum);
	
	/* Get exercise parameters from the Firebase database */
	var querySnapshot = await getExercise();
	
	querySnapshot.forEach(doc => {
		exercise.push([
			doc.data().name,
			doc.data().imageURL
		]);
	});
	
	exercise = exercise.slice(1);
	
	
	querySnapshot = await getRoutineHistory(id);
	querySnapshot.forEach(doc => {
		matEH.push(doc.data().exerciseArray);
		matCH.push(doc.data().counterArray);
		matMH.push(doc.data().minutes);
		matSH.push(doc.data().seconds);
	});
	
	querySnapshot = await getStoredRoutines(id);
	querySnapshot.forEach(doc => {
		matNS.push(doc.data().name);
		matDS.push(doc.data().comment);
		matES.push(doc.data().exerciseArray);
		matCS.push(doc.data().counterArray);
		matMS.push(doc.data().minutes);
		matSS.push(doc.data().seconds);
		matPS.push(doc.data().personalEvaluation);
	});

	putHistory();
})

tabControl.addEventListener('click', function(ev){
  
  if ( ev.target.tagName.toLowerCase() == 'a' ) {
    markActiveTab(ev.target);
  }
  
});

function markActiveTab(tab){
  var parentLeft = tab.parentElement.getBoundingClientRect().left;
  var left = tab.getBoundingClientRect().left;
  var width = tab.offsetWidth;
  tabUnderline.style.width = width + 14 + 'px';
  tabUnderline.style.left = ( left - parentLeft ) + 'px';
}

const history = document.getElementById('history');

history.addEventListener('click', putHistory, false);


/**
 * Shows routines performed.
 *
 * @returns {void}
 * @name putHistory
 * @function
 * @memberof myRoutines
 */
function putHistory() {
	container.innerHTML = "";
	
	for(let i=0; i<matEH.length; i++) {
		const routine = document.createElement('a');
		const imageER = document.createElement('div');
		const restTime = document.createElement('p');
		
		imageER.id = 'imageER';
		
		for(let j=0; j<matEH[i].length; j++) {
			if(matEH[i][j] != -1) {
				const c = document.createElement('div');
				const img = document.createElement('img');
				img.src = "../VisualFiles/" + exercise[matEH[i][j]][1];
				const rep = document.createElement('p');
				rep.textContent = matCH[i][j] + 'x ' + exercise[matEH[i][j]][0];
				
				rep.id = 'rep';
				
				c.appendChild(img);
				c.appendChild(rep);
				
				imageER.appendChild(c);
				imageER.style.paddingTop = '20px';
			}
			else
				j = matEH[i].length;
		}
		
		restTime.textContent = 'Descanso: ' + matMH[i] + 'min ' + matSH[i] + 'seg';
				
		restTime.classList.add('restTime');
		
		routine.appendChild(imageER);
		routine.appendChild(restTime);
		
		routine.classList.add('grid-item');
		
		routine.id = i + '-routine';
		
		container.appendChild(routine);
		
		routine.addEventListener('click', function(event) {
			var routineID = event.currentTarget.id.split('-');

			saveCurrentRoutine(event, container, matEH[routineID[0]], matCH[routineID[0]], matMH[routineID[0]], matSH[routineID[0]]);
		});
	}
	
	const input1 = document.createElement('input');
	const input2 = document.createElement('input');
		
	input1.value = id;
	input2.value = 0;
		
	input1.name = 'userID';
	input2.name = 'TRID';
	
	input1.style.visibility = 'hidden';
	input2.style.visibility = 'hidden';
		
	container.appendChild(input1);
	container.appendChild(input2);
}

const saved = document.getElementById('saved');


/**
 * Shows routines saved.
 *
 * @returns {void}
 * @name saved_eventClick
 * @function
 * @memberof myRoutines
 */
saved.addEventListener('click', (event) => {
	container.innerHTML = "";
	
	for(let i=0; i<matES.length; i++) {
		const routine = document.createElement('a');
		const routineName = document.createElement('p');
		const separator = document.createElement('hr');
		const ratingG = document.createElement('span');
		const rating = document.createElement('p');
		const description = document.createElement('p');
		const imageER = document.createElement('div');
		const restTime = document.createElement('p');
				
		imageER.id = 'imageER';
		
		for(let j=0; j<matES[i].length; j++) {
			if(matES[i][j] != -1) {
				const c = document.createElement('div');
				const img = document.createElement('img');
				img.src = "../VisualFiles/" + exercise[matES[i][j]][1];
				const rep = document.createElement('p');
				rep.textContent = matCS[i][j] + 'x ' + exercise[matES[i][j]][0];
				
				rep.id = 'rep';
				
				c.appendChild(img);
				c.appendChild(rep);
				
				imageER.appendChild(c);
			}
			else
				j = matES[i].length;
		}
		
		var r = matPS[i];
		var string = "";
		
		for(let i=0; i<5-r; i++) {
			ratingG.textContent += '⭐️';
		}
		ratingG.style.filter = 'grayscale(100%)';
				
		for(let i=0; i<r; i++)
			string += '⭐️';
		
		rating.appendChild(ratingG);
		rating.appendChild(document.createTextNode(string));
		
		routineName.textContent = matNS[i];
		description.innerHTML = '<strong>Descripción:</strong>' + ' ' + matDS[i];
		restTime.textContent = 'Descanso: ' + matMS[i] + 'min ' + matSS[i] + 'seg';
			
		routineName.classList.add('roomName');
		rating.classList.add('rating');
		description.classList.add('description');
		restTime.classList.add('restTime');
		
		rating.style.marginLeft = '20px';
		rating.style.marginBottom = '10px';
		
		routine.appendChild(routineName);
		routine.appendChild(separator);
		routine.appendChild(rating);
		routine.appendChild(description);
		routine.appendChild(imageER);
		routine.appendChild(restTime);
		
		routine.id = i + '-routine';
				
		routine.classList.add('grid-item');
		
		container.appendChild(routine);
		
		routine.addEventListener('click', function(event) {
			var routineID = event.currentTarget.id.split('-');
			saveCurrentRoutine(event, container, matES[routineID[0]], matCS[routineID[0]], matMS[routineID[0]], matSS[routineID[0]]);
		});		
	}
	
	const input1 = document.createElement('input');
	const input2 = document.createElement('input');
		
	input1.value = id;
	input2.value = 0;
		
	input1.name = 'userID';
	input2.name = 'TRID';
	
	input1.style.visibility = 'hidden';
	input2.style.visibility = 'hidden';
		
	container.appendChild(input1);
	container.appendChild(input2);
});


/**
 * Save current configurated routine to be execute.
 *
 * @returns {void}
 * @name saveCurrentRoutine
 * @function
 * @memberof myRoutines
 */
function saveCurrentRoutine(event, container, matE, matC, matM, matS) {
	event.preventDefault();
	
	currentRoutineStore(id, matE, matC, matM, matS, container);
}
