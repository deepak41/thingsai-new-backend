var nconf = require('nconf');
nconf.set('NODE_PORT', '80');
nconf.set('url', 'http://localhost');
nconf.set('secret', 'devdacticIsAwesome');
nconf.set('database', 'mongodb://localhost/thingsaidb');

nconf.set('mserver', 'http://alerts.thethingscloud.com')

