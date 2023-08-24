/**
 * REST API serving the system.
 * @namespace
 * @name apiREST
 */

const session = require('express-session');
const bodyParser = require('body-parser');
const { google } = require('googleapis');
const express = require('express');
var open = require('open');
var fs = require('fs');


/**
 * Server listening port.
 * @type {number}
 * @memberof apiREST
 */
var port = 3000;

/**
 * The Express application.
 * @type {import('express').Express}
 * @memberof apiREST
 */
var app = express();


app.set("view engine", "ejs");
app.set("views", __dirname + "/public");

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
	secret: "secret-key",
	resave: true,
	saveUninitialized: false
}))


/**
 * Module for account routes.
 * @module accountRoutes
 * @see {@link module:accountRoutes}
 * @memberof apiREST
 */
const authRoutes = require('./authRoutes.js');


/**
 * Module for profile routes.
 * @module profileRoutes
 * @see {@link module:profileRoutes}
 * @memberof apiREST
 */
const profileRoutes = require('./profileRoutes.js');

/**
 * Module for makeRoutine routes.
 * @module makeRoutineRoutes
 * @see {@link module:makeRoutineRoutes}
 * @memberof apiREST
 */
const makeRoutineRoutes = require('./makeRoutineRoutes.js');

/**
 * Module for poseNet routes.
 * @module poseNetRoutes
 * @see {@link module:poseNetRoutes}
 * @memberof apiREST
 */
const poseNetRoutes = require('./poseNetRoutes.js');

/**
 * Module for trainingRooms routes.
 * @module trainingRoomsRoutes
 * @see {@link module:trainingRoomsRoutes}
 * @memberof apiREST
 */
const trainingRoomsRoutes = require('./trainingRoomsRoutes.js');

/**
 * Module for statistics routes.
 * @module statisticsRoutes
 * @see {@link module:statisticsRoutes}
 * @memberof apiREST
 */
const stadisticsRoutes = require('./stadisticsRoutes.js');

/**
 * Module for main routes.
 * @module mainRoutes
 * @see {@link module:mainRoutes}
 * @memberof apiREST
 */
const mainRoutes = require('./mainRoutes.js');


app.use('/', authRoutes);
app.use('/', profileRoutes);
app.use('/', makeRoutineRoutes);
app.use('/', poseNetRoutes);
app.use('/', trainingRoomsRoutes);
app.use('/', stadisticsRoutes);
app.use('/', mainRoutes);


/**
 * Starts the application's server and listens on the specified port.
 *
 * @param {number} port - The port number to listen on.
 * @param {Function} callback - The callback function to be executed when the server starts listening.
 *                             It takes an error object as a parameter (if any).
 * @memberof apiREST
 * @function listen
 */
app.listen(port, function(err){
})
