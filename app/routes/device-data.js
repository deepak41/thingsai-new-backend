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
			.get(auth.authenticate, Device.authorize("reader"), Device.checkSlave, Utils.pagination, function(req, res, next) {
				DeviceData.paginate({
					device_id: req.query.device_id, 
					slave_id: req.query.slave_id
				}, { offset: res.locals.offset, limit: res.locals.pagesize }, function(err, result) {
					if(err) return next(err);
					res.json({
						error: false,
						message: "Device Data found successfully.",
						data: result.docs
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
