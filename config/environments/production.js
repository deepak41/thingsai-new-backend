var nconf = require('nconf');
nconf.set('NODE_PORT', '80');
nconf.set('url', 'http://localhost');
nconf.set('secret', 'sunnyday');
nconf.set('fserviceAccount', 'thingsai-test-firebase-adminsdk-54c39-0eec70d9db.json')
nconf.set('fdatabaseURL', 'https://thingsai-test.firebaseio.com/');
nconf.set('track-user', '../config/helpers/track-user.json');
// nconf.set('database', 'mongodb://localhost/thingsaidb');
// nconf.set('frontend-server', 'http://beta.thingsai.io');
nconf.set('frontend-server', 'http://13.233.134.17');
//nconf.set('database', 'mongodb://52.66.25.200:27017,13.233.144.238:27017,13.233.166.29:27017/thingsaidb?replicaSet=rsthingsai');
nconf.set('database', 'mongodb://thingsaiDev:things123@13.233.134.217:27017,13.232.230.147:27017/thingsaidb?authSource=admin&replicaSet=rsthingsai');