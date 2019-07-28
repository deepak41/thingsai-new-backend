var Device = require("../models/devices");
var User = require("../models/users");
var SlaveType = require("../models/slave-types");

module.exports = function(router) {
	'use strict';

		// to find a device, url: /api/devices
		router.route('/')
			.get(auth.authenticate, Device.authorize("reader"), function(req, res, next) {
				Device.findOne({device_id: req.query.device_id}, (err, device) => {
					if (err) return next(err);
					if(device) {
						res.json({
							error: false,
							message: "Device found successfully.",
							data: device
						})	
					}
					else {
						User.findOne({email: res.locals.userInfo.email}, (err, user) => {
							user.devices.find((obj, index) => {
							    if (obj.device_id == req.query.device_id) {
							        user.devices.splice(index, 1);
							        return true; // stop searching
							    }
							});
							user.save((err, test) => {
								if (err) return next(err);
								return next({
									status: 404,
									message: "No Device found!"
								});
							});
						});
					}
				});	
			})

			// to create a new device.
			.post(auth.authenticate, function(req, res, next) {
				Device.create(req.body, (err, device) => {
					if(err && err.code == 11000) return next({
		                status: 409,
		                message: "Device ID is already registered!",
		                device_id: req.body.device_id
		            });
				    if (err) return next(err);
				    User.findOne({email: res.locals.userInfo.email}, (err, user) => {
						user.devices = user.devices.concat([{
							role: "owner",
							name: device.name,
							device_id: device.device_id
						}]);
						user.save((err, user) => {
							if (err) return next(err);
							return res.json({
								error: false,
								message: "Device created successfully.",
								data: req.body.device_id
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
					User.findOne({email: res.locals.userInfo.email}, (err, user) => {
						user.devices.find((obj, index) => {
						    if (obj.device_id == req.query.device_id) {
						        user.devices.splice(index, 1);
						        return true; // stop searching
						    }
						});
						user.save((err, test) => {
							if (err) return next(err);
							return res.json({
								error: false,
								message: "Device deleted successfully."
							})
						});
					});
				});												
			});


		// to get all devices of a user, url: /api/devices/all-devices
		router.route('/all-devices')
			.get(auth.authenticate, function(req, res, next) {
				return res.json({
					error: false,
					message: "Devices found successfully",
					data: res.locals.userInfo.devices
				});

			})


		// to add a slave, url: /api/devices/edit-slaves
		router.route('/edit-slaves')
			.post(auth.authenticate, Device.authorize("writer"), SlaveType.authorize, function(req, res, next) {
				Device.findOne({device_id: req.query.device_id}, (err, device) => {
					if(err) return next(err);
					if(!device) return next({
						status: 404,
		                message: "Device does not exist!"
					});
					var slave = device.slaves.find(obj => obj.slave_id == req.body.slave_id);
					if(slave) return next({
						status: 409,
		                message: "Slave ID is already in use!"
					});
					device.slaves = device.slaves.concat([{
						type: req.body.type,
						slave_id: req.body.slave_id
					}]);
					device.save((err, doc) => {
						if(err) return next(err);
						return res.json({
							error: false,
							message: "Slave added successfully.",
							data: doc
						})
					});
				});
			})


		// to create a new device by admin
		router.route('/create-by-admin')
			.post(function(req, res, next) {
				Device.create(req.body, (err, device) => {
				    if (err) return next(err);

				    User.findOne({email: req.query.email}, (err, user) => {
						user.devices.push({device_id: device.device_id, role: "owner"});
						user.save((err, test) => {
							if (err) return next(err);
							return res.json({
								error: false,
								message: "Device created successfully."
							})
						});
					});
			    })
			})


	
}
