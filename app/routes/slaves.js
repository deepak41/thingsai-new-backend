var Slave = require("../models/slaves");
var User = require("../models/users");

module.exports = function(router) {
	'use strict';

		// for getting all devices of a user, url: /api/slaves
		router.route('/')
			.get(auth.authenticate, function(req, res, next) {

				return res.json({
					error: false,
					message: "Slaves found successfully",
					data: res.locals.userInfo.devices
				});

			})

			// to create a new slave.
			.post(/*auth.authenticate,*/ function(req, res, next) {
				Slave.create(req.body, (err, device) => {
				    if (err) return next(err);
					return res.json({
						error: false,
						message: "Slave created successfully.",
						data: device
					})
			    })
			})
	
}
