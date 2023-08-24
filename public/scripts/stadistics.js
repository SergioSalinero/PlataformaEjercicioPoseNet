/**
 * Shows personal stadistics.
 * @namespace
 * @name stadistics
 */

import { 
	getUserID,
	getSpecificMensualStadistics
} from './apiDAO.js';


/**
 * Initialises all stadistic views.
 *
 * @param {string} id - The user ID.
 * @returns {void}
 * @name eventLoad
 * @function
 * @memberof stadistics
 */
const id = document.getElementById('id').innerHTML;

window.addEventListener('load', async () => {
	const back = document.getElementById('back');
	back.href= '/main?id=' + id;
	
	mensualStadistics("month");
	calorieStadistic("month");
	muscleGroupStadistic();
	timeStadistic("month");
})


var canvas0 = document.getElementById('canvas0');

const select = document.getElementById('stadistic-change-C0');

select.addEventListener('change', function() {
	const existingChart = Chart.getChart('canvas0');
	if (existingChart) 
		existingChart.destroy();
		
	mensualStadistics(this.value);
})


/**
 * Process stadistics of released routines.
 *
 * @param {string} token - View of stadistics.
 * @returns {void}
 * @name mensualStadistics
 * @function
 * @memberof stadistics
 */
async function mensualStadistics(token) {
	const ctx = canvas0.getContext('2d');
	

	var labels, data;
	if(token == 'week') {	
		labels = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

		const today = new Date();
		const dayOfWeek = labels[today.getDay()];
		const position = labels.indexOf(dayOfWeek) + 1;
	
		data = new Array(7).fill(0);
		var currentDate = new Date().getTime()
		var auxDate = currentDate - 86400000 * position;	
	
		var querySnapshot = await getSpecificMensualStadistics(id, auxDate);
		
		querySnapshot.forEach((doc) => {
			const position = labels.indexOf(doc.data().day);
			data[position] = doc.data().routines;
		});
	}
	else {
		const date = new Date();
		const dayOfMonth = date.getDate();
		
		labels = new Array(31);
		for(let i = 0; i < 31; i++)
			labels[i] = (i + 1).toString();
				
		var auxDate = date - 86400000 * dayOfMonth;
		data = new Array(31).fill(0);
		var querySnapshot = await getSpecificMensualStadistics(id, auxDate);
		
		querySnapshot.forEach((doc) => {
			data[doc.data().dayN - 1] += doc.data().routines;
		});
	}

	
	const chartConfig = {
		type: 'bar',
		data: {
			labels: labels,
			datasets: [{
				label: 'Rutinas realizadas',
				data: data,
				backgroundColor: 'rgba(27, 59, 161, 0.2)',
				borderColor: 'rgba(25, 54, 225, 1)',
				borderWidth: 2
			}]
		},
	};

	new Chart(ctx, chartConfig);
}


const canvas1 = document.getElementById('canvas1');

const select_C1 = document.getElementById('stadistic-change-C1');

select_C1.addEventListener('change', function() {
	const existingChart = Chart.getChart('canvas1');
	if (existingChart) 
		existingChart.destroy();
		
	calorieStadistic(this.value);
})


/**
 * Process stadistics of burned calories.
 *
 * @param {string} token - View of stadistics.
 * @returns {void}
 * @name caloriesStadistic
 * @function
 * @memberof stadistics
 */
async function calorieStadistic(token) {
	const ctx1 = canvas1.getContext('2d');
	

	var labels, data;
	if(token == 'week') {	
		labels = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

		const today = new Date();
		const dayOfWeek = labels[today.getDay()];
		const position = labels.indexOf(dayOfWeek) + 1;
	
		data = new Array(7).fill(0);
		var currentDate = new Date().getTime()
		var auxDate = currentDate - 86400000 * position;	
	
		var querySnapshot = await getSpecificMensualStadistics(id, auxDate);
		
		querySnapshot.forEach((doc) => {
			const position = labels.indexOf(doc.data().day);
			data[position] = doc.data().calories;
		});
	}
	else {
		const date = new Date();
		const dayOfMonth = date.getDate();
		
		labels = new Array(31);
		for(let i = 0; i < 31; i++)
			labels[i] = (i + 1).toString();
				
		var auxDate = date - 86400000 * dayOfMonth;
		data = new Array(31).fill(0);
		var querySnapshot = await getSpecificMensualStadistics(id, auxDate);
		
		querySnapshot.forEach((doc) => {
			data[doc.data().dayN - 1] += doc.data().calories;
		});
	}

	
	const chartConfig = {
		type: 'line',
		data: {
			labels: labels,
			datasets: [{
				label: 'Calorías quemadas',
				data: data,
				backgroundColor: 'rgba(27, 59, 161, 0.2)',
				borderColor: 'rgba(25, 54, 225, 1)',
				borderWidth: 2
			}]
		}
	};

	new Chart(ctx1, chartConfig);
}

const canvas2 = document.getElementById('canvas2');


/**
 * Process stadistics of muscle groups trained.
 *
 * @returns {void}
 * @name muscleGroupStadistic
 * @function
 * @memberof stadistics
 */
async function muscleGroupStadistic() {
	const ctx2 = canvas2.getContext('2d');
	
	var troncoAnterior, troncoPosterior, brazos, piernas;
	var labels = ['Tronco anterior', 'Tronco posterior', 'brazos', 'piernas'];
	var data = new Array(4).fill(0);
	
	const querySnapshot = await getUserID(id);
	
	var routines, trainingTime;
	
	querySnapshot.forEach(doc => {
		data[0] = doc.data().troncoAnterior;
		data[1] = doc.data().troncoPosterior;
		data[2] = doc.data().brazos;
		data[3] = doc.data().piernas;
	});
	
	
	const chartConfig = new Chart(ctx2, {
		type: 'pie',
		data: {
			labels: labels,
    			datasets: [{
				data: data,
				backgroundColor: ['#ff6384', '#36a2eb', '#ffce56', '#84fa22']
			}]
		}
	});
}


const canvas3 = document.getElementById('canvas3');

const select_C3 = document.getElementById('stadistic-change-C3');

select_C3.addEventListener('change', function() {
	const existingChart = Chart.getChart('canvas3');
	if (existingChart) 
		existingChart.destroy();
		
	timeStadistic(this.value);
})


/**
 * Process stadistics of time trained.
 *
 * @param {string} token - View of stadistics.
 * @returns {void}
 * @name timeStadistic
 * @function
 * @memberof stadistics
 */
async function timeStadistic(token) {
	const ctx3 = canvas3.getContext('2d');
	

	var labels, data;
	if(token == 'week') {	
		labels = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

		const today = new Date();
		const dayOfWeek = labels[today.getDay()];
		const position = labels.indexOf(dayOfWeek) + 1;
	
		data = new Array(7).fill(0);
		var currentDate = new Date().getTime()
		var auxDate = currentDate - 86400000 * position;	
	
		var querySnapshot = await getSpecificMensualStadistics(id, auxDate);
		
		querySnapshot.forEach((doc) => {
			const position = labels.indexOf(doc.data().day);
			data[position] = doc.data().minutes;
		});
	}
	else {
		const date = new Date();
		const dayOfMonth = date.getDate();
		
		labels = new Array(31);
		for(let i = 0; i < 31; i++)
			labels[i] = (i + 1).toString();
				
		var auxDate = date - 86400000 * dayOfMonth;
		data = new Array(31).fill(0);
		var querySnapshot = await getSpecificMensualStadistics(id, auxDate);
		
		querySnapshot.forEach((doc) => {
			data[doc.data().dayN - 1] += doc.data().minutes;
		});
	}

	
	const chartConfig = {
		type: 'bar',
		data: {
			labels: labels,
			datasets: [{
				label: 'Tiempo entrenado',
				data: data,
				backgroundColor: 'rgba(27, 59, 161, 0.2)',
				borderColor: 'rgba(25, 54, 225, 1)',
				borderWidth: 2
			}]
		}
	};

	new Chart(ctx3, chartConfig);
}

