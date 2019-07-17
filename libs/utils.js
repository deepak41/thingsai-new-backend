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


Utils.findLocationByIp = function(ip, time, callback) {
	time = time.toLocaleString();
	var access_key = "9d07c3ddbbcf20c5dbe5d4a5fae09c14";
	// ip = "115.99.16.198";

	if(ip.substr(0, 7) == "::ffff:") ip = ip.substr(7);

	request.get({
		url: "http://api.ipstack.com/" + ip + "?access_key=" + access_key	
	}, 
	function(error, response, body) {
		body = JSON.parse(body);

		result={}
		result.ip = body.ip;
		result.city = body.city;
		result.region_name = body.region_name;
		result.country_name = body.country_name;
		result.continent_name = body.continent_name;
		result.latitude = body.latitude;
		result.longitude = body.longitude;
		result.time = time;

		callback(error, result);
	});	
}


Utils.logIntoFile = function(data) {
	if(!fs.existsSync(path.join(__dirname, '../logs'))) 
	    fs.mkdirSync(path.join(__dirname, '../logs'));
	
	var log_file = fs.createWriteStream(path.join(__dirname, '../logs') + '/access.log', {flags : 'a'});
	log_file.write(util.format(data) + '\n');
}

