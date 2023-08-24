/**
 * Frontend DAO API.
 * @namespace
 * @name apiDAO
 */


import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { 
	getFirestore,
	collection,
	addDoc,
	getDocs,
	getCountFromServer,
	query,
	orderBy,
	where,
	doc,
	deleteDoc,
	updateDoc,
	limit,
	increment
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";


/**
 * Firebase configuration.
 *
 * @typedef {Object} FirebaseConfig
 * @property {string} apiKey - La clave de API de Firebase.
 * @property {string} authDomain - El dominio de autenticación de Firebase.
 * @property {string} projectId - El ID del proyecto de Firebase.
 * @property {string} storageBucket - El bucket de almacenamiento de Firebase.
 * @property {string} messagingSenderId - El ID del remitente de mensajes de Firebase.
 * @property {string} appId - El ID de la aplicación de Firebase.
 * @property {string} measurementId - El ID de medición de Firebase.
 * @memberof apiDAO
 */

/**
 * Firebase configuration.
 *
 * @type {FirebaseConfig}
 * @memberof apiDAO
 */
const firebaseConfig = {
	apiKey: "AIzaSyAAVEZNFCkZLkWsXklG3pqUEnlb8zqdccs",
	authDomain: "posenet-application.firebaseapp.com",
	projectId: "posenet-application",
	storageBucket: "posenet-application.appspot.com",
	messagingSenderId: "987868618988",
	appId: "1:987868618988:web:6e1f53ae39fb713dbf05c9",
	measurementId: "G-84TMZ5MKMV"
};


/**
 * Initialises the application with the Firebase configuration.
 *
 * @param {object} config - The Firebase configuration.
 * @returns {object} - The initialised instance of the application.
 * @memberof apiDAO
 */
const app = initializeApp(firebaseConfig);

/**
 * Gets the Firestore instance.
 * @returns {object} - The Firestore instance.
 * @memberof apiDAO
 */
const db = getFirestore();


/**
 * Update user data.
 *
 * @param {string} name - User's first name.
 * @param {string} lastname - User's last name.
 * @param {string} id - User ID.
 * @param {string} mail - User's email address.
 * @param {number} weight - User's weight.
 * @param {number} height - Height of user.
 * @param {HTMLFormElement} form - HTML Form Element.
 * @returns {Promise<void>} - Promise that is resolved once the data has been updated and the form has been submitted.
 * @function
 * @name updateUserData
 * @memberof apiDAO
 */
export const updateUserData = async (name, lastname, id, mail, weight, height, form) => {
	const querySnapshot = await getDocs(query(collection(db, 'userData'), where('id', '==', id)));
	
	querySnapshot.forEach((doc) => {
		updateDoc(doc.ref, {
			name: name,
			lastname: lastname,
			email: mail,
			weight: weight,
			height: height
		}).then(function(docRef) {
			form.submit();
		})
	});
}

/**
 * Gets the documents from the 'userData' collection that match the provided ID.
 *
 * @param {string} id - The user ID.
 * @returns {Promise} - A promise that resolves to the fetched documents.
 * @function
 * @name getUserID
 * @memberof apiDAO
 */
export const getUserID = (id) => getDocs(query(collection(db, 'userData'), where('id', '==', id)));

/**
 * Obtains user data.
 *
 * @returns {Promise<Array>} A promise that is resolved with an array of objects representing the user's data.
 * @function
 * @name getUserData
 * @memberof apiDAO
 */
export const getUserData = () => getDocs(query(collection(db, 'userData'), orderBy("lastname"), orderBy("name")));

/**
 * Gets user data sorted by seconds trained.
 *
 * @returns {Promise<Array>} A promise that resolves to an array of objects with user data.
 * @function
 * @name getUserDataRanking
 * @memberof apiDAO
 */
export const getUserDataRanking = () => getDocs(query(collection(db, 'userData'), orderBy("secondsTrained", "desc")));

/**
 * Deletes a user according to their ID.
 *
 * @param {string} id - The ID of the user to delete.
 * @param {HTMLFormElement} form - The form associated with the user.
 * @returns {Promise<void>} - A promise that resolves when the user has been successfully removed.
 * @function
 * @name removeUser
 * @memberof apiDAO
 */
export const removeUser = async (id, form) => {
	var querySnapshot = await getDocs(query(collection(db, 'currentRoutine'), where('userID', '==', id)));
	if(querySnapshot.length != 0)
		querySnapshot.forEach((doc) => {
			deleteDoc(doc.ref);
		})

	querySnapshot = await getDocs(query(collection(db, 'myRoutines'), where('userID', '==', id)));
	if(querySnapshot.length != 0)
		querySnapshot.forEach((doc) => {
			deleteDoc(doc.ref);
		})
	
	querySnapshot = await getDocs(query(collection(db, 'userData'), where('id', '==', id)));
	querySnapshot.forEach((doc) => {
		deleteDoc(doc.ref)
		.then(() => {
			form.submit();
		});
	})
}

/**
 * Updates the role of a user.
 *
 * @param {string} id - The user's ID.
 * @param {string} role - The user's new role.
 * @returns {Promise<void>} - A promise that is resolved when the role update completes.
 * @function
 * @name UpdateRole
 * @memberof apiDAO
 */
export const updateRole = async (id, role) => {
	const querySnapshot = await getDocs(query(collection(db, 'userData'), where('id', '==', id)));
	
	querySnapshot.forEach((doc) => {
		updateDoc(doc.ref, { role: role })
	});
}

/**
 * Gets the count of all currently stored users.
 *
 * @returns {Promise<number>} The user count.
 * @function
 * @name getUserCount
 * @memberof apiDAO
 */
export const getUserCount = () => getCountFromServer(collection(db, 'userData'));

/**
 * Gets the confirmation code for a given user.
 
 * @param {string} username - The user name for which you wish to obtain the confirmation code.
 * @returns {Promise<Array>} - A promise that is resolved with an array of objects representing the documents obtained.
 * @function
 * @name getConfirmCode
 * @memberof apiDAO
 */
export const getConfirmCode = (username) => getDocs(query(collection(db, 'userData'), where('nickname', '==', username)));

/**
 * Updates the confirmation code.
 
 * @param {string} id - The user ID.
 * @param {HTMLFormElement} confirm_form - The confirmation form.
 * @returns {Promise<void>} A promise that is resolved when the code update is complete and the form is submitted.
 * @function
 * @name updateConfirmCode
 * @memberof apiDAO
 */
export const updateConfirmCode = async (id, confirm_form) => { 
	const querySnapshot = await getDocs(query(collection(db, 'userData'), where('id', '==', id)));
	
	querySnapshot.forEach((doc) => {
		updateDoc(doc.ref, { confirmCode: -1 })
		.then(function(docRef) {
			confirm_form.submit();
		})
	});
};

/**
 * Gets all documents in the collection 'exercises' sorted by the 'id' field.
 *
 * @returns {Promise<DocumentSnapshot>} A promise that resolves to an array of DocumentSnapshot.
 * @function
 * @name getExercise
 * @memberof apiDAO
 */
export const getExercise = () => getDocs(query(collection(db, 'exercises'), orderBy("id")));

/**
 * Gets the number of exercises from the server.
 *
 * @returns {Promise<number>} A promise that resolves to the number of exercises.
 * @function
 * @name getExerciseCount
 * @memberof apiDAO
 */
export const getExerciseCount = () => getCountFromServer(collection(db, 'exercises'));

/**
 * Stores the current routine for a given user.
 *
 * @param {string} id - User ID.
 * @param {Array<number>} exerciseRoutineArray - Array of exercises in the routine.
 * @param {Array<number>} repRoutineArray - Array of repetitions of the routine.
 * @param {number} restTimeMinutes - Minutes of rest.
 * @param {number} restTimeSeconds - Seconds of rest.
 * @param {HTMLFormElement} routineForm - Routine Form.
 * @returns {Promise<void>}
 * @function
 * @name currentRoutineStore
 * @memberof apiDAO
 */
export const currentRoutineStore = (id, exerciseRoutineArray, repRoutineArray, restTimeMinutes, restTimeSeconds, routineForm) => {
	addDoc(collection(db, 'currentRoutine'), { 
		userID: id,
		exerciseArray: exerciseRoutineArray,
		counterArray: repRoutineArray,
		minutes: restTimeMinutes,
		seconds: restTimeSeconds
	}).then(function(docRef) {
		routineForm.submit();
	});
};

/**
 * Gets the current routine for a specific user.
 *
 * @param {string} id - User ID.
 * @returns {Promise<Array>} - A promise that resolves to an array of objects representing the current routine's documents.
 * @function
 * @name getCurrentRoutine
 * @memberof apiDAO
 */
export const getCurrentRoutine = (id) => getDocs(query(collection(db, 'currentRoutine'), where("userID", "==", id)));

/**
 * Deletes a user's previous current routines.
 *
 * @param {string} id - ID of the user.
 * @returns {Promise<void>} - A promise that is resolved when routines are removed.
 * @function
 * @name removeOlderCurrentRoutine
 * @memberof apiDAO
 */
export const removeOlderCurrentRoutine = async (id) => { 
	const collectionRef = collection(db, 'currentRoutine');
	const q = query(collectionRef, where("userID", "==", id));
	const querySnapshot = await getDocs(q);
	
	querySnapshot.forEach((doc) => {
		deleteDoc(doc.ref);
	});
};

/**
 * Updates the current routine with the supplied values.
 *
 * @param {string} id - ID of the user.
 * @param {Array<number>} exerciseCompleted - Indicates the exercise completed.
 * @param {Array<number>} repCompleted - Number of reps completed for each exercise.
 * @param {number} minutesWork - Minutes of work.
 * @param {number} secondsWork - Seconds of work.
 * @param {HTMLFormElement} form - Form object.
 * @returns {Promise<void>} - A promise that is resolved when the update is complete.
 * @function
 * @name updateCurrentRoutine
 * @memberof apiDAO
 */
export const updateCurrentRoutine = async (id, exerciseCompleted, repCompleted, minutesWork, secondsWork, form) => {
	const querySnapshot = await getDocs(query(collection(db, 'currentRoutine'), where('userID', '==', id)));
	
	querySnapshot.forEach((doc) => {
		updateDoc(doc.ref, {
			exerciseCompleted: exerciseCompleted,
			repCompleted: repCompleted,
			minutesWork: minutesWork,
			secondsWork: secondsWork
		}).then(function(docRef) {
			form.submit();
		})
	});
};

/**
 * Updates the current routine with the supplied values.
 * @param {string} id - ID of the user.
 * @param {Array<number} exerciseCompleted - Indicates the exercises completed.
 * @param {Array<number>} repCompleted - Number of reps completed.
 * @param {number} minutesWork - Minutes of work.
 * @param {number} secondsWork - Seconds of work.
 * @param {HTMLFormElement} form - Form element to submit after refresh.
 * @returns {Promise<void>}
 * @function
 * @name getLastRoutineID
 * @memberof apiDAO
 */
export const getLastRoutineId = (id) => getDocs(query(collection(db, 'myRoutines'), orderBy("routineID", "desc"), where("userID", "==", id), limit(1)));

/**
 * Stores a routine in the database.
 * @param {string} routineID - ID of the routine.
 * @param {string} nameI - Name of the routine.
 * @param {string} commentI - Comment of the routine.
 * @param {string} userID - ID of the user.
 * @param {Array<number>} exerciseRoutineArray - Array of exercises in the routine.
 * @param {Array<number>} repRoutineArray - Array of repetitions of the routine.
 * @param {number} restTimeMinutes - Rest time in minutes.
 * @param {number} restTimeSeconds - Rest time in seconds.
 * @param {string} personalEvaluation - Personal evaluation.
 * @param {HTMLButtonElement} button - Button object.
 * @returns {Promise<void>}
 * @function
 * @name storeRoutines
 * @memberof apiDAO
 */
export const storeRoutines = (routineID, nameI, commentI, userID, exerciseRoutineArray, repRoutineArray, restTimeMinutes, restTimeSeconds, personalEvaluation, button) => {
	addDoc(collection(db, 'myRoutines'), { 
		routineID: routineID,
		name: nameI,
		comment: commentI,
		userID: userID,
		exerciseArray: exerciseRoutineArray,
		counterArray: repRoutineArray,
		minutes: restTimeMinutes,
		seconds: restTimeSeconds,
		personalEvaluation: personalEvaluation
	}).then(function(docRef) {
		button.disabled = false;
	});
};

/**
 * Gets the routines stored for a specific user.
 *
 * @param {string} userID - ID of the user.
 * @returns {Promise<Array>} - A promise that resolves to an array of routine documents.
 * @function
 * @name getStoredRoutines
 * @memberof apiDAO
 */
export const getStoredRoutines = (userID) => getDocs(query(collection(db, 'myRoutines'), where('userID', '==', userID)));

/**
 * Stores the history of routines in the database.
 *
 * @param {string} userID - ID of the user.
 * @param {Array<number>} exerciseArray - Array of exercises.
 * @param {Array<number>} counterArray - Array of counters.
 * @param {number} minutes - Minutes of the routine.
 * @param {number} seconds - Seconds of the routine.
 * @returns {Promise<void>}
 * @function
 * @name storeRoutinesHistory
 * @memberof apiDAO
 */
export const storeRoutineHistory = (userID, exerciseArray, counterArray, minutes, seconds) => {
	addDoc(collection(db, 'history'), {
		userID: userID,
		exerciseArray: exerciseArray,
		counterArray: counterArray,
		minutes: minutes,
		seconds: seconds
	})
}

/**
 * Get the workout history for a specific user.
 *
 * @param {string} userID - ID of the user for whom you want to get routine history.
 * @returns {Promise<Array>} - Promise that resolves to an array of objects representing the history of routines.
 * @function
 * @name getRoutineHistory
 * @memberof apiDAO
 */
export const getRoutineHistory = (userID) => getDocs(query(collection(db, 'history'), where('userID', '==', userID)));

/**
 * You get a training room for your ID.
 *
 * @param {string} id - The ID of the training room.
 * @returns {Promise<Array>} A promise that resolves to an array of training room documents.
 * @function
 * @name getTrainingRoomID
 * @memberof apiDAO
 */
export const getTrainingRoomID = (id) => getDocs(query(collection(db, 'TRs'), where('id', '==', id)));

/**
 * Gets the last workout ID stored in a given training room.
 *
 * @param {string} id - ID of the training room.
 * @returns {Promise<Array>} - A promise that resolves to an array of objects with information from the routines.
 * @function
 * @name getLastRoutineTRID
 * @memberof apiDAO
 */
export const getLastRoutineTRId = (id) => getDocs(query(collection(db, 'TRroutines'), orderBy('routineID', 'desc'), where('TRID', '==', id), limit(1)));

/**
 * Store training routines from training rooms.
 * @param {string} routineID - ID of the routine.
 * @param {string} TRID - Training room ID.
 * @param {string} nameI - Name of the routine.
 * @param {string} commentI - Comment about the routine.
 * @param {Array<number>} exerciseRoutineArray - Array of exercises in the routine.
 * @param {Array<number>} repRoutineArray - Array of repetitions of the routine.
 * @param {number} restTimeMinutes - Rest time in minutes.
 * @param {number} restTimeSeconds - Rest time in seconds.
 * @param {HTMLFormElement} form - HTML form to submit the data.
 * @returns {Promise<void>}
 * @function
 * @name storeRoutinesTR
 * @memberof apiDAO
 */
export const storeRoutinesTR = (routineID, TRID, nameI, commentI, exerciseRoutineArray, repRoutineArray, restTimeMinutes, restTimeSeconds, form) => {
	addDoc(collection(db, 'TRroutines'), { 
		routineID: routineID,
		TRID: TRID,
		name: nameI,
		comment: commentI,
		exerciseArray: exerciseRoutineArray,
		counterArray: repRoutineArray,
		minutes: restTimeMinutes,
		seconds: restTimeSeconds,
	}).then(function(docRef) {
		form.submit();
	});
};

/**
 * Gets the training room by ID.
 *
 * @param {string} TRID - Training room ID.
 * @returns {Promise<Array>} - Promise that resolves to an array of objects representing the training room routines.
 * @function
 * @name getRoutinesTRID
 * @memberof apiDAO
 */
export const getRoutinesTRID = (TRID) => getDocs(query(collection(db, 'TRroutines'), orderBy('routineID', 'asc'), where('TRID', '==', TRID)));

/**
 * Upgrades the rating of a training room.
 *
 * @param {string} TRID - Training room ID.
 * @param {number} personalEvaluation - Personal evaluation.
 * @param {HTMLFormElement} form - Form to submit after update.
 * @returns {Promise<void>}
 * @function
 * @name updateRating
 * @memberof apiDAO
 */
export const updateRating = async (TRID, personalEvaluation, form) => {
	var querySnapshot = await getDocs(query(collection(db, 'TRs'), where('id', '==', TRID)));
	
	querySnapshot.forEach((doc) => {
		updateDoc(doc.ref, {
			ratingCont: increment(personalEvaluation),
			views: increment(1)		
		}).then(async function(docRef) {
			querySnapshot = await getDocs(query(collection(db, 'TRs'), where('id', '==', TRID)));
			
			var ratingCont;
			var views;
			
			querySnapshot.forEach((doc) => {
				ratingCont = doc.data().ratingCont;
				views = doc.data().views;
			});
			
			updateDoc(doc.ref, {
				rating: Math.round(ratingCont / views)
			}).then(function(docRef) {
				form.submit();
			});
		});
	});
}

/**
 * Removes a routine from a training room.
 *
 * @param {string} TRID - ID of training room.
 * @param {string} routineID - ID of the routine to remove.
 * @returns {Promise<void>} A promise that is resolved after routine removal is complete.
 * @function
 * @name removeRoutine
 * @memberof apiDAO
 */
export const removeRoutine = async (TRID, routineID) => {
	var querySnapshot = await getDocs(query(collection(db, 'TRroutines'), where('TRID', '==', TRID), where('routineID', '==', routineID)));
	querySnapshot.forEach((doc) => {
		deleteDoc(doc.ref);
	});
}

/**
 * Delete a room and make a form submission.
 *
 * @param {string} TRID - ID of the training room.
 * @param {HTMLFormElement} form - Form to submit after deleting the room.
 * @returns {Promise<void>} A promise that is resolved when the room has been deleted and the form has been submitted.
 * @function
 * @name removeRoom
 * @memberof apiDAO
 */
export const removeRoom = async (TRID, form) => {
	const querySnapshot = await getDocs(query(collection(db, 'TRs'), where('id', '==', TRID)));
	querySnapshot.forEach((doc) => {
		deleteDoc(doc.ref).then(function(docRef) {
			form.submit();
		});
	});
}

/**
 * Updates a training room in the database and redirects the user to a specific page.
 *
 * @param {string} TRID - The ID of the training room to be updated.
 * @param {string} name - The new name for the training room.
 * @param {string} description - The new description for the training room.
 * @param {string} userID - The ID of the user.
 * @returns {Promise<void>} - A promise that is resolved when the TR update is complete.
 * @function
 * @name updateTR
 * @memberof apiDAO
 */
export const updateTR = async (TRID, name, description, userID) => {
	const querySnapshot = await getDocs(query(collection(db, 'TRs'), where('id', '==', TRID)));
	querySnapshot.forEach((doc) => {
		updateDoc(doc.ref, {
			name: name,
			description: description
		}).then(function(docRef) {
			location.href = '/specific_tr?userID=' + userID + '&roomID=' + TRID;
		});
	});
}

/**
 * Gets documents from training rooms based on specified filter and order.
 *
 * @param {string} filter - The field by which you want to filter the documents.
 * @param {string} order - The order in which you want to fetch the documents ('asc' for ascending, 'desc' for descending).
 * @returns {Promise<Array>} - A promise that resolves to an array of training room documents.
 * @function
 * @name getTrainingRoomsFilter
 * @memberof apiDAO
 */
export const getTrainingRoomsFilter = (filter, order) => getDocs(query(collection(db, 'TRs'), orderBy(filter, order)));

/**
 * Gets the list of training rooms sorted by date.
 *
 * @param {string} order - Sort order ('asc' for ascending, 'desc' for descending).
 * @returns {Promise<Array>} - Promise that resolves to an array of training room documents.
 * @function
 * @name getTrainingRoomsDate
 * @memberof apiDAO
 */
export const getTrainingRoomsDate = (order) => getDocs(query(collection(db, 'TRs'), orderBy('creationDate', order)));

/**
 * Add a subscription to the database.
 *
 * @param {string} userID - ID of the user.
 * @param {string} TRID - Room ID.
 * @returns {Promise<void>}
 * @function
 * @name addSubscription
 * @memberof apiDAO
 */
export const addSubscription = (userID, TRID) => {
	addDoc(collection(db, 'subscriptions'), {
		userID: userID,
		roomID: TRID
	});
}

/**
 * You get a subscription based on user ID and room ID.
 *
 * @param {string} userID - ID of the user.
 * @param {string} TRID - Room ID.
 * @returns {Promise<Array>} - A promise that resolves to an array of subscription documents.
 * @function
 * @name getSubscription
 * @memberof apiDAO
 */
export const getSubscription = (userID, TRID) => {
	return getDocs(query(collection(db, 'subscriptions'), where('userID', '==', userID), where('roomID', '==', TRID)));
}

/**
 * Removes all subscriptions of a user to a specific room.
 *
 * @param {string} userID - ID of the user.
 * @param {string} TRID - Room ID.
 * @returns {Promise<void>} - Void promise.7
 * @function
 * @name removeSubscription
 * @memberof apiDAO
 */
export const removeSubscription = async (userID, TRID) => {
	const querySnapshot = await getDocs(query(collection(db, 'subscriptions'), where('userID', '==', userID), where('roomID', '==', TRID)));
	
	querySnapshot.forEach((doc) => {
		deleteDoc(doc.ref);
	});
}

/**
 * Add monthly statistics to the statistics document.
 *
 * @param {string} userID - ID of the user.
 * @param {number} routines - Routines performed.
 * @param {string} trainingTime - Training time in minutes.
 * @param {nmber} completionDate - Statistics completion date.
 * @param {string} dayOfWeek - Day of the week.
 * @param {number} dayOfMonth - Day of the month.
 * @param {number} calories - Calories burned during the workout.
 * @param {number} minutesWork - Minutes worked.
 * @returns {void}
 * @function
 * @name addMensualStadistics
 * @memberof apiDAO
 */
export const addMensualStadistics = (userID, routines, trainingTime, completionDate, dayOfWeek, dayOfMonth, calories, minutesWork) => {
	addDoc(collection(db, 'mensualStadistics'), {
		userID: userID,
		routines: routines,
		trainingTime: trainingTime,
		completionDate: completionDate,
		day: dayOfWeek,
		dayN: dayOfMonth,
		calories: calories,
		minutes: minutesWork
	})
}

/**
 * Update monthly statistics.
 *
 * @param {string} userID - ID of the user.
 * @param {number} routines - Routines.
 * @param {number} trainingTime - Training time.
 * @param {number} completionDate - Current completion date.
 * @param {number} newDate - New end date.
 * @param {number} dayOfMonth - Day of the month.
 * @param {number} calories - Calories.
 * @param {number} minutesWork - Minutes of work.
 * @returns {Promise<void>}
 * @function
 * @name updateMensualStadistics
 * @memberof apiDAO
 */
export const updateMensualStadistics = async (userID, routines, trainingTime, completionDate, newDate, dayOfMonth, calories, minutesWork) => {
	var querySnapshot = await getDocs(query(collection(db, 'mensualStadistics'), where('userID', '==', userID), where('completionDate', '>', completionDate), where('dayN', '==', dayOfMonth)));
	
	querySnapshot.forEach((doc) => {
		updateDoc(doc.ref, {
			routines: routines,
			trainingTime: trainingTime,
			completionDate: newDate,
			calories: increment(calories),
			minutes: increment(minutesWork)
		})
	})	
}

/**
 * Get the monthly statistics for a specific user.
 *
 * @param {string} userID - ID of the user.
 * @returns {Promise<Array>} - A promise that resolves to an array of objects with monthly statistics.
 * @function
 * @name getMensualStadistics
 * @memberof apiDAO
 */
export const getMensualStadistics = (userID) => {
	return getDocs(query(collection(db, 'mensualStadistics'), where('userID', '==', userID), orderBy('completionDate', 'desc'), limit(1)));
}

/**
 * Update a user's activity.
 *
 * @param {string} userID - ID of the user.
 * @param {number} routines - User routines.
 * @param {string} trainingTime - Training time.
 * @param {number} secondsTrained - Seconds trained.
 * @param {number} troncoAnterior - "Tronco anterior" activity.
 * @param {number} troncoPosterior - "Tronco posterior" activity.
 * @param {number} brazos - "Brazos" activity.
 * @param {number} piernas - "Piernas" activity.
 * @returns {Promise<void>} - Void promise.
 * @function
 * @name updateUserActivity
 * @memberof apiDAO
 */
export const updateUserActivity = async (userID, routines, trainingTime, secondsTrained, troncoAnterior, troncoPosterior, brazos, piernas) => {
	var querySnapshot = await getUserID(userID);
	
	querySnapshot.forEach((doc) => {
		updateDoc(doc.ref, {
			routines: routines,
			trainingTime: trainingTime,
			secondsTrained: increment(secondsTrained),
			troncoAnterior: increment(troncoAnterior),
			troncoPosterior: increment(troncoPosterior),
			brazos: increment(brazos),
			piernas: increment(piernas)
		})
	})
}

/**
 * Gets the specific monthly statistics of a user.
 *
 * @param {string} userID - ID of the user.
 * @param {number} completionDate - Minimum completion date for the statistics.
 * @returns {Promise<Array>} - Promise that resolves to an array of monthly statistics documents.
 * @function
 * @name getSpecificMensualStadistics
 * @memberof apiDAO
 */
export const getSpecificMensualStadistics = (userID, completionDate) => {
	return getDocs(query(collection(db, 'mensualStadistics'), where('userID', '==', userID), where('completionDate', '>', completionDate), orderBy('completionDate', 'asc')));
}
