var DeviceData = require("../models/device-data");
var Device = require("../models/devices");
var User = require("../models/users");
var SlaveType = require("../models/slave-types");

module.exports = function(router) {
	'use strict';

		// to send device data, url: /api/device-data
		router.route('/')
			.post(auth.authenticate, Device.authorize("writer"), Device.checkSlave, function(req, res, next) {
				req.body.by_user = res.locals.userInfo.email;
				DeviceData.create(req.body, (err, data) => {
					if(err) return next(err);
					res.json({
						error: false,
						message: "Device Data sent successfully.",
						data: data
					})
				});				
			})



		// to find device data, url: /api/device-data
		router.route('/')
			.get(auth.authenticate, Device.authorize("reader"), Device.checkSlave, function(req, res, next) {
				DeviceData.find({
					device_id: req.query.device_id, 
					slave_id: req.query.slave_id
				}, { $skip: 1, $limit: 20 }, (err, data) => {
					if(err) return next(err);
					res.json({
						error: false,
						message: "Device Data found successfully.",
						data: data
					})
				});	
			});


		// to create a new device data by admin
		router.route('/create-by-admin')
			.post(function(req, res, next) {
				DeviceData.create(req.body, (err, data) => {
					if(err) return next(err);
					res.json({
						error: false,
						message: "Device Data sent successfully.",
						data: data
					})
				});
			})
	
}
