var Device = require("../models/devices");
var User = require("../models/users");

module.exports = function(router) {
	'use strict';

		// for getting all devices of a user. url: /api/devices
		router.route('/')
			.get(auth.authenticate, function(req, res, next) {

				return res.json({
					error: false,
					message: "Devices found successfully",
					data: res.locals.userInfo.devices
				});

			})

			// to create a new device.
			.post(auth.authenticate, function(req, res, next) {
				Device.create(req.body, function (err, device) {
				    if (err) return next(err);

				    User.findOne({email: res.locals.userInfo.email}, function(err, user) {
						user.devices.push({device_id: device.device_id, role: "owner"});
						user.save(function(err, test) {
							if (err) return next(err);
							return res.json({
								error: false,
								message: "Device created successfully."
							})
						});
					});
			    })
			})

			// to update a device.
			.put(auth.authenticate, Device.authorize("writer"), function(req, res, next) {
				Device.findOneAndUpdate({device_id: req.query.device_id}, req.body, (err, doc) => {
					if (err) return next(err);
					return res.json({
						error: false,
						message: "Device updated successfully."
					})
					
				});	
			})

			// to delete a device.
			.delete(auth.authenticate, Device.authorize("owner"), function(req, res, next) {
				Device.findOneAndRemove({device_id: req.query.device_id}, (err, device) => {
					if (!device) return next("err");
					User.findOne({email: res.locals.userInfo.email}, function(err, user) {
						user.devices.find((obj, index) => {
						    if (obj.device_id == req.query.device_id) {
						        user.devices.splice(index, 1);
						        return true; // stop searching
						    }
						});
						user.save(function(err, test) {
							if (err) return next(err);
							return res.json({
								error: false,
								message: "Device deleted successfully."
							})
						});
					});
				});												
			});
	
}
