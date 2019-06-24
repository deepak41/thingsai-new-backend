global.express = require('express');
// global.socket = require("socket.io");
global.config = require('nconf');
global.logger = require('winston');
global.passport = require('passport');
global.Services = require('../../libs/services');
global.validator = require('express-validator');
global.validate = require('express-validation');
global.messages = require('../helpers/messages');
global.request = require('request');
global.store = require('store2');
global.async = require('async');


var path = require('path');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var RateLimit = require('express-rate-limit');
var flog = require('../../libs/flog');

/*Code for firebase*/
global.fadmin = require("firebase-admin");
global.fdb;
/*Code for firebase*/


var app;

var start = function(cb) {
	'use strict';

	app = express();

	// app.set('view engine', 'ejs');

	mongoose.connect(config.get('database'), {
		useMongoClient: true
	});
	mongoose.Promise = global.Promise;
	app.use(morgan('common'));
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(bodyParser.json({
		type: '*/*'
	}));

	// var getToken = function() {
	// 	Services.login(function(err, response) {
	// 		if(err) {
	// 			logger.info('[APP] ERROR could not get admin session token from baas server');
	// 		}
	// 		else {
	// 			store.set('sessionToken', response);
	// 			logger.info('[APP] SUCCESS Got admin session token from baas server');

	// 		}			
	// 	})
	// };
	// getToken();


	app.use(validator());
	logger.info('[SERVER] Initializing routes');

	global.auth = require("../../libs/auth");

	app.use(function(req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Authorization, Content-Type, Accept");
		res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
		next();
	});


	/*Code for firebase*/
	var serviceAccount = require("../../public/" + config.get('fserviceAccount'));
	fadmin.initializeApp({
		credential: fadmin.credential.cert(serviceAccount),
		databaseURL: config.get('fdatabaseURL')
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
	require('../../app/routes/index')(app);

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
	

	app.use(function(err, req, res, next) {

		flog.crit(err, "IP=" + req.connection.remoteAddress, "URL=" + req.url, "METHOD=" + req.method);
		
	});

	var server = app.listen(config.get('NODE_PORT'));
	// logger.info('[SERVER] Listening on port ' + config.get('NODE_PORT'));

	logger.info('[SERVER] The server has started on ' + config.get('url') + ":" + config.get('NODE_PORT'));

	// Rtalerts.test(server);

	if (cb) {
		return cb();
	}
};

module.exports = start;
