var Utils = module.exports = {};

Utils.isEmptyObject = function(obj) {
	for (var key in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, key)) {
			return false;
		}
	}
	return true;
}
Utils.isEmail = function(em) {
	return validator.isEmail(em);
}
Utils.minLenght = function(pass, mn) {
	return pass.length >= mn;
}

Utils.makeSalt = function(pass, mn) {
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for (var i = 0; i < 32; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));

	return text;
}


Utils.validateSignup = function(req, res, next) {
	req.checkBody("email", messages.users.post.email).notEmpty().isEmail();
	req.checkBody("password", messages.users.post.password).notEmpty().isLength({
		min: 6,
		max: 15
	});
	req.checkBody("name", messages.users.post.name).optional().isLength({
		min: 3,
		max: 50
	});
	/*req.checkBody("role", messages.users.post.role).isNumeric().isInt({
    gt: 0,
    lt: 4
});*/
	var errors = req.validationErrors();
	if (!errors) next();
	else {
		errors.status = 422;
		next(errors);
	}
}


Utils.validateSignIn = function(req, res, next) {
	req.checkBody("email", messages.users.post.email).notEmpty().isEmail();
	req.checkBody("password", messages.users.post.password).notEmpty().isLength({
		min: 6,
		max: 15
	});

	var errors = req.validationErrors();
	if (!errors) next();
	else {
		errors.status = 422;
		next(errors);
	}
}

Utils.validateDeviceData = function(req, res, next) {
	req.checkBody("device_id", messages.deviceData.post.device_id).notEmpty().isInt({
		gt: 0
	});
	req.checkBody("slave_id", messages.deviceData.post.slave_id).notEmpty().isNumeric().isInt({
		gt: -1
	});
	// req.checkBody("site_id", messages.deviceData.post.site_id).notEmpty().isNumeric().isInt({
	// 	gt: 0
	// });
	req.checkBody("dts", messages.deviceData.post.dts).optional().isNumeric().isInt({
		gt: 1506067069
	});
	req.checkBody("data", messages.deviceData.post.data).notEmpty();
	var errors = req.validationErrors();
	if (!errors) next();
	else {
		errors.status = 422;
		next(errors);
	}
}
Utils.validateDeviceCreate = function(req, res, next) {

	delete req.body.site_id;
	req.checkBody("device_id", messages.deviceData.post.device_id).notEmpty().isInt({
		gt: 0
	});
	req.checkBody("slaves", messages.deviceData.post.slave_id).optional();

	var errors = req.validationErrors();
	if (!errors) next();
	else {
		errors.status = 422;
		next(errors);
	}
}


Utils.validateDeviceUpdate = function(req, res, next) {

	delete req.body.site_id;

	req.checkBody("slaves", messages.deviceData.post.slave_id).optional();

	var errors = req.validationErrors();
	if (!errors) next();
	else {
		errors.status = 422;
		next(errors);
	}
}


Utils.validateSiteUpdate = function(req, res, next) {
	req.checkParams("id", "Please Enter a Valid Site id").notEmpty().isInt({
		gt: 0
	});
	req.checkBody("devices", "Please Enter a Valid Device ids").optional();

	var errors = req.validationErrors();
	if (!errors) next();
	else {
		errors.status = 422;
		next(errors);
	}
};
Utils.validateSiteCreate = function(req, res, next) {
	req.checkBody("site_id", "Please Enter a Valid Site id").notEmpty().isInt({
		gt: 0
	});
	req.checkBody("devices", "Please Enter a Valid Device ids").optional();

	var errors = req.validationErrors();
	if (!errors) next();
	else {
		errors.status = 422;
		next(errors);
	}
};
Utils.validateEditSite = function(req, res, next) {
	if (req.body.devices && Array.isArray(req.body.devices) && req.body.devices.length > 0) next()
	else next({
		status: 422,
		message: "'devices' is needed and should be an array"
	})
};
Utils.ArrayDiff = function(a1, a2) {
	var a2Set = new Set(a2);
	return a1.filter(function(x) {
		return !a2Set.has(x);
	});
};
Utils.flatten = function(arr) {
	return arr.reduce(function(flat, toFlatten) {
		return flat.concat(Array.isArray(toFlatten) ? Utils.flatten(toFlatten) : toFlatten);
	}, []);
}
Utils.validateDeviceDataGet = function(req, res, next) {
	//one cannot query device_id. it needs to have site_id. can be empty or just site_id or site_id & device_id or site_id or slave_id
	var invalidSite = false; //true means not there
	var invalidDevice = false; //true means not there
	if (req.query.site_id === undefined || isNaN(req.query.site_id) || req.query.site_id <= 0) {
		invalidSite = true;
		res.locals.siteOptional = true
	}
	if (req.query.device_id === undefined || isNaN(req.query.device_id) || req.query.device_id <= 0) {
		invalidDevice = true;
		res.locals.deviceOptional = true
	}
	if (req.query.slave_id === undefined || isNaN(req.query.slave_id) || req.query.slave_id <= 0) {
		invalidSlave = true;
		res.locals.slaveOptional = true
	}
	//if device is there without site then there is an error
	if (invalidSite && !invalidDevice) next({
		status: 422,
		message: "can not access device without site Please input 'site_id'"
	})
	else next()
}
Utils.concatArraysUniqueWithSort = function(thisArray, otherArray) {
	var newArray = thisArray.concat(otherArray).sort(function(a, b) {
		return a > b ? 1 : a < b ? -1 : 0;
	});

	return newArray.filter(function(item, index) {
		return newArray.indexOf(item) === index;
	});
};
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
Utils.projection = function(req, res, next) {
	var p_agg = {};
	var p_ = "";
	if (req.query.projects) {
		p_ = req.query.projects.split(",").join(" ");
		p_agg = {
			$project: req.query.projects.split(",").reduce(function(previousValue, currentValue, index) {
				previousValue[currentValue] = 1;
				return previousValue;
			}, {})
		}
	}
	res.locals.p_agg = p_agg;
	res.locals.p_ = p_;
	next();
}




Utils.sendMail = function(rpToken, email, name, callback) {

	var alertServer = "http://139.59.79.210"

	request.post({
			headers: {
				'Content-Type': 'application/json'
			},
			url: alertServer + '/api/alertmails/send-reset-password-mail',
			form: {
				"to": email,
				"name": name,
				"token": rpToken
			}
		},
		function(error, response, body) {
			var parsedJSON = JSON.parse(body);
			callback(error, parsedJSON);
		});
}