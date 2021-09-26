var nconf = require('nconf');
nconf.set('NODE_PORT', '3000');
nconf.set('url', 'http://localhost');
nconf.set('secret', 'sunnyday');
nconf.set('fserviceAccount', 'thingsai-test-firebase-adminsdk-54c39-0eec70d9db.json')
nconf.set('fdatabaseURL', 'https://thingsai-test.firebaseio.com/');
nconf.set('track-user', '../config/helpers/track-user.json');
// nconf.set('database', 'mongodb://localhost/thingsaidb');
nconf.set('frontend-server', 'http://beta.thingsai.io');

nconf.set('database', 'mongodb://thingsaiDev:things123@13.233.134.217:27017,13.232.230.147:27017/thingsaidb?authSource=admin&replicaSet=rsthingsai');
