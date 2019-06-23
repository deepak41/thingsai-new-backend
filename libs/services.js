var fs = require("fs"); 
var webshot = require('webshot');
var path = require('path');
var mkdirp = require('mkdirp');
var calendar = require('node-calendar');


var Services = module.exports = {};


Services.login = function(callback) {

	request.post({
		headers: {
			'Content-Type': 'application/json'
		},
		url: 'http://baas.thethingscloud.com/api/sessions',
		form: {
	        "email": "admin@thethingscloud.com",
    		"password": "admin123"
	    }
	}, 
	function(error, response, body) {

		var token = null;

		if(error == null) {
			var parsedJSON = JSON.parse(body);
			token = parsedJSON["token"];
		}

		callback(error, token);
	});
};


Services.getFilesizeInBytes = function(filename) {

	const stats = fs.statSync(filename);
    const fileSizeInBytes = stats.size;

    return fileSizeInBytes;
};


Services.createPdf = function(site_id, start_ts, end_ts, report_name, callback) {

	var options = {
		streamType: "png",
		windowSize: {
			width: 1240,
			height: 1754
		},
		shotSize: {
			width: "all",
			height: "all"
		},
		renderDelay: 6000
	};


	var url = config.get('mserver') +"/api/reporttypes/" + report_name + "?site_id=" + site_id + "&start_ts=" + start_ts + "&end_ts=" + end_ts;
	
	var file_path = path.join(__dirname, '../reports') + "/";
	var file_name = "Report_for_site_" + site_id + "_" + start_ts + "_" + end_ts +".pdf";
	var output_file = file_path + file_name;

	webshot(url, output_file, options, function(err) {

		var data = "/reports/" + file_name;
		callback(err, data, output_file);
	})
};



Services.sendMonthlyPdfReportMail = function(pdf_file, recipients, month, callback) {

	var client = new Mailin("https://api.sendinblue.com/v2.0","rBIy6wFgPHqxCdcL");
			
	var data = { 
		"id" : 13,
		"to" : recipients,
		"attr" : {"month": month},
		"attachment_url" : pdf_file
    }
 
    client.send_transactional_template(data).on('complete', function(data) {

    	var data = JSON.parse(data);

		if(data["code"] == "success") {
			var result = {
				error: false,
				message: "Report sent successfully!",
				data: data
			};
        }
        else {
        	var result = {
				error: true,
				message: "The email was not sent!",
				data: data
			};
        }

		callback(result);
    });
};


Services.sendDailyPdfReportMail = function(pdf_file, recipients, site_id, day, callback) {

	var client = new Mailin("https://api.sendinblue.com/v2.0","rBIy6wFgPHqxCdcL");
			
	var data = { 
		"id" : 15,
		"to" : recipients,
		"attr" : {"day": day, "site_id": site_id},
		"attachment_url" : pdf_file
    }
 
    client.send_transactional_template(data).on('complete', function(data) {

    	var data = JSON.parse(data);

		if(data["code"] == "success") {
			var result = {
				error: false,
				message: "Report sent successfully!",
				data: data
			};
        }
        else {
        	var result = {
				error: true,
				message: "The email was not sent!",
				data: data
			};
        }

		callback(result);
    });
};


Services.sendDailyReportNoDataMail = function(recipients, site_id, day, callback) {

	var client = new Mailin("https://api.sendinblue.com/v2.0","rBIy6wFgPHqxCdcL");
			
	var data = { 
		"id" : 17,
		"to" : recipients,
		"attr" : {"day": day, "site_id": site_id}
    }
 
    client.send_transactional_template(data).on('complete', function(data) {

    	var data = JSON.parse(data);

		if(data["code"] == "success") {
			var result = {
				error: false,
				message: "No data email sent successfully!",
				data: data
			};
        }
        else {
        	var result = {
				error: true,
				message: "The No data email was not sent!",
				data: data
			};
        }

		callback(result);
    });
};


Services.sendNoDataAlertMail = function(recipients, device_id,ts, callback) {

	var client = new Mailin("https://api.sendinblue.com/v2.0","rBIy6wFgPHqxCdcL");
			
	var data = { 
		"id" : 19,
		"to" : recipients,
		"attr" : {"device_id": device_id, "last_ts" : new Date(ts*1000).toLocaleString()},
    }
 
    client.send_transactional_template(data).on('complete', function(data) {

    	var data = JSON.parse(data);

		if(data["code"] == "success") {
			var result = {
				error: false,
				message: "No data email sent successfully!",
				data: data
			};
        }
        else {
        	var result = {
				error: true,
				message: "The No data email was not sent!",
				data: data
			};
        }

		callback(result);
    });
};


Services.createFolder = function(folder, callback) {

	var x = path.join(__dirname, '../reports');
	x = x + folder;

	mkdirp(x, function(err) {
		return callback(err, "created");

	});
};


Services.findDateRangeForAMonth = function(year, month) {

	var output = calendar.monthrange(year, month);

	var start_ts = calendar.timegm([year, month, 1, 0, 0, 0]);
	start_ts = start_ts - 19800;

	var end_ts = calendar.timegm([year, month, output[1], 23, 59, 0]);
	end_ts = end_ts - 19800;

	return [start_ts, end_ts];
};


Services.findMonthName = function(month) {

	var monthNames = [ "January", "February", "March", "April", "May", "June", 
                       "July", "August", "September", "October", "November", "December" ];

    return monthNames[month-1];
};

Services.findDateFromTS = function(ts) {

	var d = new Date(ts*1000);
	var result = d.getDate() + " " + Services.findMonthName(d.getMonth()+1)

	return result
};

Services.findFullDateFromTS = function(ts) {

	var d = new Date(ts*1000);
	var result = d.getDate() + "-" + Services.findMonthName(d.getMonth()+1) + "-" + d.getFullYear();

	return result
};

Services.findStartAndEndTsOfADay = function(d) {

	var newDate = d.getDate() + "-" + (d.getMonth()+1) + "-" + d.getFullYear()

	d.setHours(0);
    d.setMinutes(0);
    d.setSeconds(0);
    d.setMilliseconds(0);

    var start_ts = d.getTime()/1000;
    var end_ts = start_ts+86400;

	return [start_ts, end_ts, newDate]
};



Services.authenticateUser = function(req, res, next) {

	request.get({
		headers: {
			'Content-Type': 'application/json',
			'Authorization': req.headers.authorization
		},
		url: 'http://baas.thethingscloud.com/api/users'
	}, 
	function(err, response, body) {

		if(err) return next(err);

		if(body == "Unauthorized") {
			return next({
	            status: 401,
	            message: "The user is unauthorized"
	        });
		};

		var parsedJSON = JSON.parse(body);
		req.user = parsedJSON.data;

		next();
	});
	
};


Services.getSiteDetails = function(token, site_id, callback) {

	request.get({
		headers: {
			'Content-Type': 'application/json',
        	'Authorization': token
		},
		url: 'http://baas.thethingscloud.com/api/sites/' + site_id,
		
	}, 
	function(error, response, body) {

		var result = null;
		if(error == null) {
			var parsedJSON = JSON.parse(body);
			var result = parsedJSON;
		}

		callback(error, result);

	});
};


Services.getReportDetails = function(report_id, callback) {

	Reporttypes.findOne({report_id: report_id}, function(err, data) {
		callback(err, data);
	})
};


Services.getAllTimeEngGenBySite = function(token, site_id, callback) {

	request.get({
		headers: {
			'Content-Type': 'application/json',
        	'Authorization': token
		},
		url: 'http://baas.thethingscloud.com/api/device-datas',
		qs: {
			accumulate_by:"y",
			accumulate_op: "sum",
			aggregate: "true",
			carry: site_id,
			group_by: "ymd",
			op: "last",
			order: "DESC",
			pageno: 1,
			pagesize: 10,
			projects: "today_wh",
			site_id: site_id,
			sts: 1199125800
		}
		
	}, 
	function(error, response, body) {

		var result = null;
		if(error == null) {
			var parsedJSON = JSON.parse(body);
			var data = parsedJSON["data"];

			var result = 0
			for(var i=0; i<data.length; i++) {
				result += data[i]["data"]["today_wh"]
			}
			result = result/100;
		}

		callback(error, result);

	});
};


Services.getEngGenBySiteByDay = function(token, site_id, callback) {

	request.get({
		headers: {
			'Content-Type': 'application/json',
        	'Authorization': token
		},
		url: 'http://baas.thethingscloud.com/api/device-datas',
		qs: {
			aggregate: "true",
			carry: site_id,
			group_by: "ymd",
			op: "last",
			order: "DESC",
			pageno: 1,
			pagesize: 10,
			projects: "today_wh",
			site_id: site_id,
			sts: 1199125800
		}
		
	}, 
	function(error, response, body) {

		var result = null;
		if(error == null) {
			var parsedJSON = JSON.parse(body);
			var data = parsedJSON["data"];

			console.log(data);
		}

		callback(error, result);

	});
};



Services.sendSmsSib = function(phone_no, message, callback) {

	var client = new Mailin("https://api.sendinblue.com/v2.0","rBIy6wFgPHqxCdcL");

	var data = { 
		"to" : phone_no,
		"from" : "Thingscloud",
		"text" : "Greetings from Thingscloud! " + message,
		"type" : "transactional"
	}

	client.send_sms(data).on('complete', function(data) {

		var data = JSON.parse(data);

		if(data["code"] == "success") {
			var err = null;

			var result = {
				message: "The SMS was sent successfully!",
				data: data
			};
        }
        else {
        	var err = {
				message: "Failed to send the SMS!",
				data: data
			};

        	var result = null;
        }

		callback(err, result);
	});

};


Services.sendSmsSmshorizon = function(phone_no, message, callback) {

	request.get({
		headers: {
			'Content-Type': 'application/json'
		},
		url: 'http://smshorizon.co.in/api/sendsms.php',
		qs: {
			user: "deepak41",
			apikey: "vx30g34H8fgUI5R2bfVf",
			// mobile: "7004632653",
			mobile: phone_no,
			message: "Greetings from Thingscloud! " + message,
			type: "txt",
			senderid: "xxyy"
		}
		
	}, 
	function(error, response, body) {

		// var parsedJSON = JSON.parse(body);

		console.log(body);

		callback(error, response);

	});

};


Services.sendSmsbulksmsgateway = function(phone_no, message, callback) {

	request.get({
		headers: {
			'Content-Type': 'application/json'
		},
		url: 'https://login.bulksmsgateway.in/sendmessage.php',
		qs: {
			user: "deepak41",
			password: "impulsar",
			// mobile: "7004632653",
			mobile: phone_no,
			sender: "THINGS",
			message: "Greetings from Thingscloud! " + message,
			type: 3
		}
		
	}, 
	function(error, response, body) {

		// var parsedJSON = JSON.parse(body);

		console.log(body);

		callback(error, response);

	});

};


Services.sendSmstop10sms = function(callback) {

	request.get({
		headers: {
			'Content-Type': 'application/json'
		},
		url: 'http://websmsapp.in/api/mt/SendSMS',
		qs: {
			user: "deepak41",
			password: "12345",
			number: "7004632653",
			senderid: "TOPTEN",
			channel:"Trans",
			DCS:0,
			flashsms:0,
			text: "hi hello world",
			route:2
		}
		
	}, 
	function(error, response, body) {

		// var parsedJSON = JSON.parse(body);

		console.log(body);

		callback(error, response);

	});

};


Services.sendAlertToFrontend = function(device_id, user_id, date, callback) {
	var form = {
		"for_user": user_id,
		"isEmail": true,
		"data": {
			"subject":"Device " + device_id + " Not Working!",
		    "body":"Device " + device_id + " is not sending any data. The last data came on " + date,
		    "image":"Test Image"
		},
		"action": {
			"url": "http://thingsio.thethingscloud.com/#!/app/view_device/" + device_id
		}
    }

	request.post({
		headers: {
			'Content-Type': 'application/json',
			'Authorization': "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.IjVhMzBkZDFkN2QwYjNhNGQzODkwYzQ4OSI.kaY6OMj5cYlWNqC2PNTkXs9PKy6_m9tdW5AG7ajfVlY"
		},
		url: 'http://13.127.227.170/api/notification',
		json: true,
		body: form
	}, 
	function(error, response, body) {

		callback(error, body);
	});

};

