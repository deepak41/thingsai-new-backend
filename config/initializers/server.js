global.express = require('express');
global.nconf = require('nconf');
global.logger = require('winston');
global.randomstring = require("randomstring");
global.Utils = require('../../libs/utils');
global.request = require('request');
global.path = require('path');
global.auth = require("../auth");
global.validate = require('express-joi-validation').createValidator({passError: true})

var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var RateLimit = require('express-rate-limit');
var http = require("http");
const https = require("https"),
  fs = require("fs");

/*Code for firebase*/
global.fadmin = require("firebase-admin");
global.fdb;
/*Code for firebase*/


var app;

var start = function(callback) {
	'use strict';

	app = express();

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
		res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
		next();
	});

	/*Code for firebase*/
	var serviceAccount = require("../helpers/" + nconf.get('fserviceAccount'));
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

	app.use(Utils.getClientDetails);

	require('../../app/routes/index')(app);
	logger.info('[SERVER] Initialized routes');

	app.use('/public', express.static(path.join(__dirname, '../../public')));
	app.use('/.well-known', express.static(path.join(__dirname, '../../.well-known')));
	
	// Error handler
	app.use(function(err, req, res, next) {
		if(err.error && err.error.details) {
			err.status = 400;
			err.message = err.error.details[0].message
		};
		res.status(err.status || 500);
		res.json({
			error: true,
			message: err.message,
			data: (app.get('env') === 'development' ? err : null)
		});
	});

	// Connect to mongodb
	mongoose.connect(nconf.get('database'), {useMongoClient: true}, function(err) {
		if(err) {
			err.message  = "[SERVER] Failed to connect to the DB"
			return callback(err)
		}
	  	logger.info('[SERVER] Successfully connected to the DB ' + nconf.get('database'));


		// var options = {
		// 	key: fs.readFileSync('/etc/letsencrypt/live/api2.thingsai.io/privkey.pem', 'utf8'),
		// 	cert: fs.readFileSync( '/etc/letsencrypt/live/api2.thingsai.io/cert.pem', 'utf8' ),
		// 	ca: fs.readFileSync( '/etc/letsencrypt/live/api2.thingsai.io/chain.pem', 'utf8' )
		// };

		// https.createServer(options, app).listen(443, () => {
  //     			console.log('HTTP Server running on port 443');
		// });

		// http.createServer(function (req, res) {
  //   		res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
  //   		res.end();
		// }).listen(80);

	  	// Start server
	 //  	http.createServer(app).listen(nconf.get('NODE_PORT'), () => {
		// 	logger.info('[SERVER] The server has started at ' + nconf.get('url') + ":" + nconf.get('NODE_PORT'));
		// });

	  	Utils.createServer(app);

	});
};

module.exports = start;
