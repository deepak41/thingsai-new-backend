var changeCase = require('change-case');
var routes = require('require-dir')();
var path = require('path');
// global.token = store.get('sessionToken');

module.exports = function (app) {
    'use strict';

    // Initialize all routes
    Object.keys(routes).forEach(function (routeName) {
        var router = express.Router();
        // You can add some middleware here 
        // router.use(someMiddleware);

        // Initialize the route to add its functionality to router
        require('./' + routeName)(router);

        // Add router to the speficied route name in the app
        app.use('/api/' + changeCase.paramCase(routeName), router);
    });
    app.get('/', function (req, res) {
        res.sendFile(path.join(__dirname, '../../public/index.html'));
    });
    app.get('/api', function (req, res) {
        res.writeHead(301, {
            Location: 'http://139.59.20.55:4096/'
        });
        res.end();
    });
};
