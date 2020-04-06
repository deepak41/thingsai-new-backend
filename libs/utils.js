require("../config/helpers/libs/mailin");
var fs = require('fs');
var util = require('util');
var http = require("http");
var https = require("https");
const redis = require('redis');


var Utils = module.exports = {};

Utils.sendPasswordResetMail = function(rpToken, email, name, callback) {
	var client = new Mailin("https://api.sendinblue.com/v2.0","rBIy6wFgPHqxCdcL");
	var data = { 
		"id" : 25,
		"to" : email,
		"attr" : {
			"TO": name,
			"link": nconf.get('frontend-server') + "/#/pages/reset-password/" + rpToken,
			"year": new Date().getFullYear()
		}		      
    };
    client.send_transactional_template(data).on('complete', (data) => {
    	data = JSON.parse(data);
		var err = null;
		if(data.code == "failure") {
			err = data;
		};
		callback(err, data)
    });
}

Utils.getClientDetails = function(req, res, next) {
	var trackUser = require(nconf.get('track-user'));
	if(nconf.get('NODE_ENV') === 'production' && trackUser.track) {
		Utils.getClientByIp(req.ip, req.path, req.method, req._startTime, (err, data) => {
			Utils.logIntoFile(err || data)
		})
	}
	next();
};

Utils.getClientByIp = function(ip, path, method, time, callback) {
	time = time.toLocaleString() + " IST";
	if(ip.substr(0, 7) == "::ffff:") ip = ip.substr(7);
	var clientInfo = {ip: ip};
	Utils.findLocationByIp(clientInfo, (err, result) => {
		result.method = method;
		result.path = path;
		result.time = time;
		callback(err, result)
	})
}

Utils.findLocationByIp = function(clientInfo, callback) {
	var access_key = "9d07c3ddbbcf20c5dbe5d4a5fae09c14";
	request.get({
		url: "http://api.ipstack.com/" + clientInfo.ip + "?access_key=" + access_key	
	}, 
	(err, response, body) => {
		body = JSON.parse(body);

		clientInfo.city = body.city;
		clientInfo.region_name = body.region_name;
		clientInfo.country_name = body.country_name;
		clientInfo.continent_name = body.continent_name;
		clientInfo.latitude = body.latitude;
		clientInfo.longitude = body.longitude;

		callback(err, clientInfo);
	});	
}

Utils.logIntoFile = function(data) {
	if(!fs.existsSync(path.join(__dirname, '../logs'))) 
	    fs.mkdirSync(path.join(__dirname, '../logs'));
	var log_file = fs.createWriteStream(path.join(__dirname, '../logs') + '/access.log', {flags : 'a'});
	log_file.write(util.format(data) + '\n');
}

Utils.pagination = function(req, res, next) {
	var pageno = 1;
	var pagesize = 500;

	res.locals.pageno = parseInt(req.query.pageno || pageno);
	if(res.locals.pageno == 0) res.locals.pageno = pageno;

	res.locals.pagesize = parseInt(req.query.pagesize || pagesize);
	if(res.locals.pagesize == 0) res.locals.pagesize = pagesize;

	res.locals.offset = (res.locals.pageno-1) * res.locals.pagesize;
	next();
}

// Utils.createServer = function(app) {
// 	if(app.get('env') === 'production') {
// 		var options = {
// 			key: fs.readFileSync('/etc/letsencrypt/live/api2.thingsai.io/privkey.pem', 'utf8'),
// 			cert: fs.readFileSync( '/etc/letsencrypt/live/api2.thingsai.io/cert.pem', 'utf8' ),
// 			ca: fs.readFileSync( '/etc/letsencrypt/live/api2.thingsai.io/chain.pem', 'utf8' )
// 		};
// 		https.createServer(options, app).listen(443, () => {
//       		logger.info('[SERVER] The server has started at ' + nconf.get('url') + ":" + 443);
// 		});
// 		http.createServer(function (req, res) {
//     		res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
//     		res.end();
// 		}).listen(80);
// 	}
// 	else {
// 		http.createServer(app).listen(nconf.get('NODE_PORT'), () => {
// 			logger.info('[SERVER] The server has started at ' + nconf.get('url') + ":" + nconf.get('NODE_PORT'));
// 		});
// 	}	
// }


Utils.createServer = function(app) {
	http.createServer(app).listen(nconf.get('NODE_PORT'), () => {
		logger.info('[SERVER] The server has started at ' + nconf.get('url') + ":" + nconf.get('NODE_PORT'));
	});	
}


Utils.redisConnect = function() {

	//const REDIS_HOST = "52.66.208.152";
	const REDIS_HOST = "127.0.0.1";
	const REDIS_PORT = 6379;
	global.redisClient = redis.createClient({
	    host: REDIS_HOST,
	    port: REDIS_PORT
	});



}


Utils.cache = function(req, res, next) {

	const { device_id } = req.query;

	redisClient.get("device_id" + device_id, (err, data) => {

		if(err) return next(err);

		if(data != null) {
			console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk")
			res.json({
				error: "falseeee",
				message: "Device found successfully!",
				data: JSON.parse(data)
			})
		}
		else
			next();

	})

}