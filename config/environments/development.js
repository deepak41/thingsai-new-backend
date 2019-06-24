var nconf = require('nconf');
nconf.set('NODE_PORT', '3000');
nconf.set('url', 'http://localhost');
nconf.set('secret', 'sunnyday');
nconf.set('database', 'mongodb://localhost/thingsaidb');

nconf.set('mserver', 'http://localhost:3000')
nconf.set('fserviceAccount', 'thingsai-test-firebase-adminsdk-54c39-0eec70d9db.json')
nconf.set('fdatabaseURL', 'https://thingsai-test.firebaseio.com/');

