/**
 * Personal routines file.
 * @namespace
 * @name poseNet
 */

/*:::: Predefined control variables ::::*/
let my_cam;
let posenet;
let noseX,noseY;
let reyeX,reyeY;
let leyeX,leyeY;
let singlePose,skeleton;
let actor_img;
let specs,smoke;

/*:::: Repetition control variables ::::*/
let cont = 0;
let alphaR, distanceR;
let alphaL, distanceL;
let numSecondsToStart = 3;

/*:::: Validate repetition variables ::::*/
let yPosR, yPosL;
let heightR, heightL;

/*:::: Pose estimation control variables ::::*/
var firstGesture = false;
var notCountR = false, notCountL = false;
var exerciseUpR = false, exerciseDownR = true;
var exerciseUpL = false, exerciseDownL = true;
var isGoodRepR = false, isGoodRepL = false;

var start = false;
var currentExercise = 0;
var exerciseParameters, exerciseParametersAux;

/*:::: Audio variables ::::*/
const countdownSoundEffect = new Audio('../SoundsEffects/CountdownSoundEffect.wav');
const finalCountdownSoundEffect = new Audio('../SoundsEffects/FinalCountdownSoundEffect.wav');

/*:::: Rest time parameters ::::*/
var restMinutes, restSeconds;
var restMinutesAux, restSecondsAux;
var restTimeInterval, restSection;
var defaults = {}
	, one_second = 1000
	, one_minute = one_second * 60
	, one_hour = one_minute * 60
	, one_day = one_hour * 24
	, face;

/*:::: Exercises parameters ::::*/
var exercise;

/*:::: Routine arrays ::::*/
var exerciseArray, counterArray;
var exerciseCompleted = [], repCompleted = [], minutesWork = [], secondsWork = [];
var userID;


window.addEventListener('load', () => {
	document.querySelector(".minute").classList.remove("timer");
	document.querySelector(".second").classList.remove("timer");

	face = document.getElementById('lazy');
})

var updateCurrentRoutine;


/**
 * Initializes the parameters obtained through FBposeNet file.
 *
 * @param {string} id - The user ID.
 * @param {Array} exercisePs - The exercises array.
 * @param {Array<number>} exerciseArrayPs - The exercise that routine contains array.
 * @param {Array<number>} counterArrayPs - The repetition array for the exercises.
 * @param {number} restMinutesPs - Rest minutes.
 * @param {number} restSecondsPs - Rest seconds.
 * @returns {void}
 * @name setupParameters
 * @function
 * @memberof poseNet
 */
function setupParameters(id, exercisePs, exerciseArrayPs, counterArrayPs, restMinutesPs, restSecondsPs, func) {
	userID = id;
	exercise = exercisePs;
	exerciseArray = exerciseArrayPs;
	counterArray = counterArrayPs;
	restMinutes = restMinutesPs;
	restSeconds = restSecondsPs;
	updateCurrentRoutine = func;
	
	initialize_parameters();
}


/**
 * Initializes the interface elements.
 *
 * @returns {void}
 * @name initialize_parameters
 * @function
 * @memberof poseNet
 */
function initialize_parameters() {
	exerciseParameters = exercise[exerciseArray[currentExercise]];

	exerciseCompleted.push(exerciseParameters[0]);
	repCompleted.push("0");
		
	var HTMLElement = document.getElementById("exercise_name");
	HTMLElement.innerHTML = exerciseParameters[1];
	HTMLElement = document.getElementById("exercise_img");
	HTMLElement.src = "../VisualFiles/" + exerciseParameters[10];
	document.getElementById('counter_repetition').innerHTML = 0 + "/" + counterArray[currentExercise];

	if(exerciseArray[currentExercise + 1] != -1) {
		exerciseParametersAux = exercise[exerciseArray[currentExercise + 1]];
		document.getElementById('next_exercise_button').innerHTML = "Sgte. ejercicio";
		HTMLElement = document.getElementById("next_exercise_image");
		HTMLElement .src = "../VisualFiles/" + exerciseParametersAux[10];
	}
	else {
		document.querySelector("#next_exercise_button").remove();
		document.querySelector("#next_exercise_image").remove();
		HTMLElement = document.querySelector("#start_button");
		HTMLElement.style.width = 250 + "px";
		HTMLElement.style.left = -165 + "px";
	}
}


/**
 * Initializes ML5 library.
 *
 * @returns {void}
 * @name setup
 * @function
 * @memberof poseNet
 */
function setup() { 
	createCanvas(640, 480);
	my_cam = createCapture(VIDEO)
	my_cam.hide();

	posenet = ml5.poseNet(my_cam, modelLoaded);
	posenet.on('pose',receivedPoses);
}


function modelLoaded() {
	console.log('Model has loaded');
}


/**
 * receives and parses the poses received from the ML5 library.
 *
 * @param {Object} poses - The poses object received from ML5 library.
 * @returns {void}
 * @name receivedPoses
 * @function
 * @memberof poseNet
 */
function receivedPoses(poses){
	if(poses.length > 0){
		singlePose = poses[0].pose;
		skeleton = poses[0].skeleton;

        
		/*:::: Calculation of the angle between the right arm and forearm ::::*/
		alphaR = calculateAngleBetweenTwoLines(poses[0].pose.keypoints[8].position, poses[0].pose.keypoints[10].position, poses[0].pose.keypoints[6].position);        

		/*:::: Calculation of the angle between the left arm and forearm ::::*/
		alphaL = calculateAngleBetweenTwoLines(poses[0].pose.keypoints[7].position, poses[0].pose.keypoints[9].position, poses[0].pose.keypoints[5].position);        

		/*:::: Capture start gesture ::::*/
		if(alphaR > 65 && alphaR < 90 && poses[0].pose.keypoints[10].position.y < poses[0].pose.keypoints[6].position.y && !firstGesture) {
			//firstGesture = true;
			startFunction();
		}

		if(alphaL > 65 && alphaL < 90 && poses[0].pose.keypoints[9].position.y < poses[0].pose.keypoints[5].position.y && !firstGesture) {
			//firstGesture = true;
			startFunction();
		}
	
		if(start)
	        exerciseDevelopment(poses); 
	}
}


/**
 * Process the poses received from ML5 library and determinate the correct execution of the exercise.
 *
 * @param {Object} poses - The poses object received from ML5 library.
 * @returns {void}
 * @name exerciseDevelopment
 * @function
 * @memberof poseNet
 */
function exerciseDevelopment(poses) {
	/*:::: Calculation of the correspondence between the angle and the height of the validation rectangle for right arm ::::*/
	if(poses[0].pose.keypoints[exerciseParameters[2]].position.y > poses[0].pose.keypoints[exerciseParameters[3]].position.y && start) {
		yPosR = 440 - alphaR * 4;
		heightR = 480 - yPosR;

		if(yPosR < yPosL) {
			var rect = document.querySelector("#validate_rectangle");
			rect.setAttribute("y", yPosR);
			rect.setAttribute("height", heightR);
		}
	}
	if(poses[0].pose.keypoints[exerciseParameters[2]].position.y <= poses[0].pose.keypoints[exerciseParameters[3]].position.y && start) {
		var rect = document.querySelector("#validate_rectangle");
			rect.setAttribute("y", 0);
			rect.setAttribute("height", 480);
		}

		/*:::: Calculation of the correspondence between the angle and the height of the validation rectangle for left arm ::::*/
		if(poses[0].pose.keypoints[exerciseParameters[4]].position.y > poses[0].pose.keypoints[exerciseParameters[5]].position.y && start) {
			yPosL = 440 - alphaL * 4;
			heightL = 480 - yPosL;

			if(yPosL < yPosR) {
				var rect = document.querySelector("#validate_rectangle");
				rect.setAttribute("y", yPosL);
				rect.setAttribute("height", heightL);
			}
		}
		if(poses[0].pose.keypoints[exerciseParameters[4]].position.y <= poses[0].pose.keypoints[exerciseParameters[5]].position.y && start) {
			var rect = document.querySelector("#validate_rectangle");
			rect.setAttribute("y", 0);
			rect.setAttribute("height", 480);
		}


		/*:::: Checking the correct perfomance of the physical exercise of the right arm ::::*/
		/*:::: Upper part ::::*/
		if(alphaR > exerciseParameters[6] && alphaR < exerciseParameters[7] && poses[0].pose.keypoints[exerciseParameters[2]].position.y <= poses[0].pose.keypoints[exerciseParameters[3]].position.y && !exerciseUpR && start) {
			isGoodRepR = true;
			exerciseUpR = true;
			exerciseDownR = false;

			if(exerciseUpL) notCountR = true;

			var rect = document.querySelector("#validate_rectangle");
			rect.setAttribute("fill", "#4CAF50");
		}
        
		/*:::: Lower part ::::*/
		if(alphaR > exerciseParameters[8] && alphaR < exerciseParameters[9] && poses[0].pose.keypoints[exerciseParameters[2]].position.y > poses[0].pose.keypoints[exerciseParameters[3]].position.y && !exerciseDownR && start) {
			isGoodRepR = false;
			exerciseUpR = false;
			exerciseDownR = true;
            
			/*:::: If the user performs the biceps curl with both arms at the same time, it will count as a single repetition ::::*/
			if(!notCountR)
				increaseCounter(0);
			else
				notCountR = false;

			var rect = document.querySelector("#validate_rectangle");
			rect.setAttribute("fill", "#F1B617");
		}

		/*:::: Checking the correct perfomance of the physical exercise of the left arm ::::*/
		/*:::: Upper part ::::*/
		if(alphaL > exerciseParameters[6] && alphaL < exerciseParameters[7] && poses[0].pose.keypoints[exerciseParameters[4]].position.y <= poses[0].pose.keypoints[exerciseParameters[5]].position.y && !exerciseUpL && start) {
			isGoodRepL = true;
			exerciseUpL = true;
			exerciseDownL = false;

			if(exerciseUpR) notCountL = true;

			var rect = document.querySelector("#validate_rectangle");
			rect.setAttribute("fill", "#4CAF50");
		}
        
		/*:::: Lower part ::::*/
		if(alphaL > exerciseParameters[8] && alphaL < exerciseParameters[9] && poses[0].pose.keypoints[exerciseParameters[4]].position.y > poses[0].pose.keypoints[exerciseParameters[5]].position.y && !exerciseDownL && start) {
			isGoodRepL = false;
			exerciseUpL = false;
			exerciseDownL = true;

			/*:::: If the user performs the biceps curl with both arms at the same time, it will count as a single repetition ::::*/
			if(!notCountL)
				increaseCounter(0);
			else
				notCountL = false;

			var rect = document.querySelector("#validate_rectangle");
			rect.setAttribute("fill", "#F1B617");
		}
}


/**
 * Control of the increase in repetitions performed in the current exercise.
 *
 * @param {number} flag - Control of the completion of the current exercise.
 * @returns {void}
 * @name increaseCounter
 * @function
 * @memberof poseNet
 */
function increaseCounter(flag) {
	if(start)
	{
		clearInterval(restTimeInterval);

		cont++;
		document.getElementById('counter_repetition').innerHTML = cont + "/" + counterArray[currentExercise];
		
		if(!flag)
			repCompleted[currentExercise] = cont;

		if(cont == counterArray[currentExercise]) {
			cont = 0;
			currentExercise++;

			if(exerciseArray[currentExercise] != -1) {
				start = false;
				restSection = true;

				document.getElementById("work_state").innerHTML = "Descanso";
				var rect = document.querySelector("#validate_rectangle");
				rect.setAttribute("y", 440);
				rect.setAttribute("height", 40);
				
				const timeAux = document.getElementById("lazy").innerHTML.split(':');
				minutesWork.push(timeAux[0]);
				secondsWork.push(timeAux[1]);
								
				initialize_parameters();

				var HTMLElement = document.getElementById("exercise_name");
				HTMLElement.innerHTML = "DESCANSO";
			}
			else {
				const timeAux = document.getElementById("lazy").innerHTML.split(':');
				minutesWork.push(timeAux[0]);
				secondsWork.push(timeAux[1]);
			
				updateCurrentRoutine(userID, exerciseCompleted, repCompleted, minutesWork, secondsWork, form);
			}
		}
	}
}


/**
 * Allows move forward to the next exercise in the routine.
 *
 * @returns {void}
 * @name nextExercise_eventClick
 * @function
 * @memberof poseNet
 */
const nextExercise = document.getElementById('next_exercise_button');
nextExercise.addEventListener('click', function(event) {
	if(start) {
		cont = counterArray[currentExercise] - 1;
		increaseCounter(1);
	}
});

var xInterval;
var isPressured = false;
const form = document.getElementById('form');
const form_button = document.getElementById('start_button');
form_button.addEventListener('click', function(event) {
	startFunction(event);
})


/**
 * Start/end the routine and initialise the started parameters.
 *
 * @returns {void}
 * @name startFunction
 * @function
 * @memberof poseNet
 */
function startFunction(e) {
	if(typeof e != 'undefined')
		e.preventDefault();
	
	if(!firstGesture) {
						
		if(!isPressured) {
			isPressured = true;
			xInterval = setInterval(function() {
				/*:::: Display the result in the element with id="countdown" ::::*/
				if (numSecondsToStart > 0) {
					document.getElementById("lazy").innerHTML = numSecondsToStart;
					countdownSoundEffect.play();
				}

				/*:::: If the count down is finished ::::*/
				if (numSecondsToStart == 0) {
					document.getElementById("lazy").innerHTML = "GO";
					finalCountdownSoundEffect.play();
					start = true;
				}
			    
				if (numSecondsToStart < 0) {
					clearInterval(xInterval);

					document.getElementById("start_button").innerHTML = "Terminar rutina";

					var starButton = document.querySelector("#start_button");
					starButton.style.background = "#F12117";
					
					firstGesture = true;

					startDate = new Date();
					start_timer();
					return;
				}
			    
				numSecondsToStart--;
			}, 1000);
		}
	}
	else {
		clearInterval(xInterval);
		
		/*document.getElementById("work_state").innerHTML = "Descanso";*/
		var rect = document.querySelector("#validate_rectangle");
		rect.setAttribute("y", 440);
		rect.setAttribute("height", 40);
		
		if(!restSection) {
			const timeAux = document.getElementById("lazy").innerHTML.split(':');
			minutesWork.push(timeAux[0]);
			secondsWork.push(timeAux[1]);
		}
		else {
			minutesWork.push(0);
			secondsWork.push(0);
		}
		
		updateCurrentRoutine(userID, exerciseCompleted, repCompleted, minutesWork, secondsWork, form);
	}
}


var requestAnimationFrame = (function() {
	return window.requestAnimationFrame       || 
		window.webkitRequestAnimationFrame || 
		window.mozRequestAnimationFrame    || 
		window.oRequestAnimationFrame      || 
		window.msRequestAnimationFrame     || 
		function( callback ){
			window.setTimeout(callback, 1000 / 60);
		};
}());


/**
 * Inicialise the timer.
 *
 * @returns {void}
 * @name start_timer
 * @function
 * @memberof poseNet
 */
function start_timer() {
	document.querySelector(".minute").classList.add("timer");
	document.querySelector(".second").classList.add("timer");

	var now = new Date()
		, elapsed = now - startDate
		, parts = [];

	if(!restSection) {
		parts[0] = '' + Math.floor( (elapsed % one_hour) / one_minute );
		parts[1] = '' + Math.floor( ( (elapsed % one_hour) % one_minute ) / one_second );

		parts[0] = (parts[0].length == 1) ? '0' + parts[0] : parts[0];
		parts[1] = (parts[1].length == 1) ? '0' + parts[1] : parts[1];
	}
	else {
		apply_rest_time();
		return;
	}

	face.innerText = parts.join(':');
  
	requestAnimationFrame(start_timer);
}

function apply_rest_time() {
	document.querySelector(".minute").classList.remove("timer");
	document.querySelector(".second").classList.remove("timer");

	restMinutesAux = restMinutes;
	restSecondsAux = restSeconds;

	restTimeInterval = setInterval(function() {
		if((restSecondsAux <= 3 && restSecondsAux >= 1) && restMinutesAux == 0)
			countdownSoundEffect.play();
		else if(restSecondsAux == 0 && restMinutesAux == 0)
			finalCountdownSoundEffect.play();				

		if(restSecondsAux == 0 && restMinutesAux == 0) {
			start = true;
			restSection = false;
			
			var HTMLElement = document.getElementById("exercise_name");
			HTMLElement.innerHTML = exerciseParameters[1];
			document.getElementById("work_state").innerHTML = "Trabajo";

			startDate = new Date();
			clearInterval(restTimeInterval);
			start_timer();
		}

		var auxSeconds = (restSecondsAux < 10) ? '0' + restSecondsAux : restSecondsAux ;
		var auxMinutes = (restMinutesAux < 10) ? '0' + restMinutesAux : restMinutesAux ; 
		face.innerText = auxMinutes + ":" + auxSeconds;
		restSecondsAux--;

		if(restSecondsAux < 0 && restMinutesAux > 0) {
			restMinutesAux--;
			restSecondsAux = 59;
		}
	}, 1000);
	
	//start_timer();
}


/**
 * Draw in canvas the poses obtained from ML5 library using P5 library.
 *
 * @returns {void}
 * @name draw
 * @function
 * @memberof poseNet
 */
function draw() {
	/*:::: images and videos(webcam) ::::*/
	translate(width,0);
	scale(-1, 1);
	image(my_cam, 0, 0);

	if(singlePose){
		for(let i=0; i<singlePose.keypoints.length; i++){
			if(start) {
				if(isGoodRepL || isGoodRepR) {
					fill(0,225,0);
					stroke(0,225,0);
				}
				else {
					fill(70,207,238);
					stroke(70,207,238);
				}
			}
			else {
				fill(255,0,0);
				stroke(255,0,0);
			}

			if(i != 0 && i != 1 && i != 2 && i != 3 && i != 4)
				ellipse(singlePose.keypoints[i].position.x, singlePose.keypoints[i].position.y,15);
		}

		strokeWeight(3);
		for(let j=0; j<skeleton.length; j++){
			if(start) {
				if(isGoodRepL || isGoodRepR) stroke(0,255,0);
				else stroke(70,207,238);
			}
			else stroke(255,0,0);
           
			line(skeleton[j][0].position.x, skeleton[j][0].position.y, skeleton[j][1].position.x, skeleton[j][1].position.y)
		}   
	}
}

