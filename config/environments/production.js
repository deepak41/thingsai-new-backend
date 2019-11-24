var nconf = require('nconf');
nconf.set('NODE_PORT', '80');
nconf.set('url', 'http://localhost');
nconf.set('secret', 'sunnyday');
nconf.set('database', 'mongodb://localhost/thingsaidb');

nconf.set('mserver', 'http://newapi.thingsai.io.com')

nconf.set('fserviceAccount', 'thingsai-test-firebase-adminsdk-54c39-0eec70d9db.json')
nconf.set('fdatabaseURL', 'https://thingsai-test.firebaseio.com/');
nconf.set('track-user', '../config/helpers/track-user.json');
