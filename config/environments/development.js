var nconf = require('nconf');
nconf.set('NODE_PORT', '3000');
nconf.set('url', 'http://localhost');
nconf.set('secret', 'devdacticIsAwesome');
nconf.set('database', 'mongodb://localhost/thingsaidb');

nconf.set('mserver', 'http://localhost:3000')

