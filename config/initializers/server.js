global.express = require('express');
global.nconf = require('nconf');
global.logger = require('winston');
global.Services = require('../../libs/services');
global.validate = require('express-validation');
global.request = require('request');
global.randomstring = require("randomstring");
global.Utils = require('../../libs/utils');

var path = require('path');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var RateLimit = require('express-rate-limit');
var http = require("http");

/*Code for firebase*/
global.fadmin = require("firebase-admin");
global.fdb;
/*Code for firebase*/


var app;

var start = function(callback) {
	'use strict';

	app = express();

	global.auth = require("../auth");

	app.use(morgan('common'));
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(bodyParser.json({
		type: '*/*'
	}));

	app.use(function(req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Authorization, Content-Type, Accept");
		res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
		next();
	});

	/*Code for firebase*/
	var serviceAccount = require("../../public/" + nconf.get('fserviceAccount'));
	fadmin.initializeApp({
		credential: fadmin.credential.cert(serviceAccount),
		databaseURL: nconf.get('fdatabaseURL')
	});
	global.fdb = fadmin.firestore();
	/*Code for firebase*/

	// max number of requests from one ip in windowMs second
	var apiLimiter = new RateLimit({
		windowMs: 1000, // 15 minutes
		max: 5,
		delayAfter: 500,
		delayMs: 500,
		handler: function(req, res, next) {
			next({
				status: 429,
				message: 'You are making calls too frequently.'
			})

		}
	});
	//app.use('/api/', apiLimiter);

	app.use(function(req, res, next) {
		console.log("----------------Client Info-------------------------------------------");
		console.log("IP=" + req.connection.remoteAddress, "URL=" + req.url, "METHOD=" + req.method);
		console.log("----------------------------------------------------------------------");
		next();
	});

	require('../../app/routes/index')(app);
	logger.info('[SERVER] Initialized routes');

	app.use('/static', express.static(path.join(__dirname, '../../staticfiles')));
	app.use('/public', express.static(path.join(__dirname, '../../public')));
	app.use('/reports', express.static(path.join(__dirname, '../../reports')));
	
	// Error handler
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.json({
			error: true,
			message: err.message,
			data: (app.get('env') === 'development' ? err : null)
		});
	});

	// Connect to mongodb
	mongoose.connect(nconf.get('database'), {useMongoClient: true}, function(error) {
		if(error) {
			error.message  = "[SERVER] Failed to connect to the DB"
			return callback(error)
		}
	  	logger.info('[SERVER] Successfully connected to the DB ' + nconf.get('database'));

	  	// Start server
	  	http.createServer(app).listen(nconf.get('NODE_PORT'), () => {
			logger.info('[SERVER] The server has started at ' + nconf.get('url') + ":" + nconf.get('NODE_PORT'));
		});
	});
};

module.exports = start;
