// /index.js
'use strict';

var server = require('./config/initializers/server');
var nconf = require('nconf');
var async = require('async');
var logger = require('winston');


// Load Environment variables from .env file
require('dotenv').load();

// Set up configs
nconf.use('memory');
// First load command line arguments
nconf.argv();
// Load environment variables
nconf.env();
// Load config file for the environment
require('./config/environments/' + nconf.get('NODE_ENV'));
logger.info('[APP] Starting server initialization');

//Initialize Modules
async.waterfall([
  function(callback) {
    server(callback);
  }],function(err, result) {
    if (err) {
      logger.error(err.message);
	  return logger.error('[APP] Initialization FAILED');
    }
	logger.info('[APP] Initialized SUCCESSFULLY');		
});