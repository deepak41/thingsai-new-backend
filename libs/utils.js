require("./mailin.js");

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