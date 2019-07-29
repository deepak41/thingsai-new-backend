require("./mailin.js");
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
    client.send_transactional_template(data).on('complete', function(data) {
    	data = JSON.parse(data);
		var err = null;
		if(data.code == "failure") {
			err = data;
		};
		callback(err, data)
    });
}

Utils.getClientByIp = function(ip, path, method, time, callback) {
	time = time.toLocaleString() + " IST";
	if(ip.substr(0, 7) == "::ffff:") ip = ip.substr(7);
	var clientInfo = {ip: ip};
	Utils.findLocationByIp(clientInfo, function(err, result) {
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
	function(err, response, body) {
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
	if (!Utils.isEmptyObject(req.query)) {
		pageno = parseInt(req.query.pageno || 1);
		if (pageno == 0) pageno = 1;
		pagesize = parseInt(req.query.pagesize || 20);
		if (pagesize == 0) pagesize = 500;
	}
	res.locals.pageno = pageno;
	res.locals.pagesize = pagesize;
	next();
}
