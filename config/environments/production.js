var nconf = require('nconf');
nconf.set('NODE_PORT', '80');
nconf.set('url', 'http://localhost');
nconf.set('secret', 'sunnyday');
nconf.set('fserviceAccount', 'thingsai-test-firebase-adminsdk-54c39-0eec70d9db.json')
nconf.set('fdatabaseURL', 'https://thingsai-test.firebaseio.com/');
nconf.set('track-user', '../config/helpers/track-user.json');
// nconf.set('database', 'mongodb://localhost/thingsaidb');
nconf.set('database', 'mongodb://52.66.25.200:27017,13.233.144.238:27017,13.233.166.29:27017/thingsaidb?replicaSet=rsthingsai');
//linode:
// nconf.set('database', 'mongodb://13.232.195.15:27107,13.126.200.63:27017,13.127.197.73:27017/thingsaidb?replicaSet=rsthingsai');