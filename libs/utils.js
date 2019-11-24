require("../config/helpers/libs/mailin");
var fs = require('fs');
var util = require('util');


var Utils = module.exports = {};

Utils.sendPasswordResetMail = function(rpToken, email, name, callback) {
	var client = new Mailin("https://api.sendinblue.com/v2.0","rBIy6wFgPHqxCdcL");
	var data = { 
		"id" : 24,
		"to" : email,
		"attr" : {
			"TO": name,
			"token": rpToken
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

