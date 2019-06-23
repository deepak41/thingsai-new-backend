var winston = logger;
var fs = require('fs');
var nconf = require('nconf');
require('dotenv').load();
nconf.env();
// check if directory exist
if (!fs.existsSync('../logs')) {
    fs.mkdirSync('../logs'); // create new directory
}


// Set up logger
var customColors = {
    trace: 'white',
    debug: 'green',
    info: 'green',
    warn: 'yellow',
    crit: 'red',
    fatal: 'red'
};

var flog = new(winston.Logger)({
    colors: customColors,
    levels: {
        trace: 0,
        debug: 1,
        info: 2,
        warn: 3,
        crit: 4,
        fatal: 5
    },
    transports: [
        new(winston.transports.Console)({
            name: 'consoleLogger',
            level: 'fatal',
            colorize: true,
            timestamp: true
        }),
        new(winston.transports.File)({
            name: 'fileLogger',
            level: 'fatal',
            filename: '../logs/node.' + nconf.get('NODE_ENV') + '.log',
            maxsize: 104857600 // 100 mb
        })
  ]
});

winston.addColors(customColors);

// Extend logger object to properly log 'Error' types
var origLog = flog.log;

flog.log = function (level, msg) {
    if (msg instanceof Error) {
        var args = Array.prototype.slice.call(arguments);
        args[1] = msg.stack;
        origLog.apply(flog, args);
    } else {
        origLog.apply(flog, arguments);
    }
};

module.exports = flog;
