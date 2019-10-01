var DeviceData = require("../models/device-data");
var Device = require("../models/devices");
var User = require("../models/users");
var SlaveType = require("../models/slave-types");
var jsonSize = require('json-size')

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


		// to get device data, url: /api/device-data
		router.route('/')
			.get(auth.authenticate, Device.authorize("reader"), Device.checkSlave, Utils.pagination, function(req, res, next) {
				var order = 1;
				if(req.query.order == "DSC") order = -1;

				var query = {};
				query.device_id = req.query.device_id;
				query.slave_id = req.query.slave_id;

				if (req.query.sts && req.query.ets) query.ts = {
					"$gte": req.query.sts,
					"$lt": req.query.ets
				};
				else if (req.query.sts && !req.query.ets) query.ts = {
					"$gte": req.query.sts
				};
				else if (!req.query.sts && req.query.ets) query.ts = {
					"$lt": req.query.ets
				};

				DeviceData.paginate(query, { 
					offset: res.locals.offset, 
					limit: res.locals.pagesize, 
					sort: {ts: order} 
				}, (err, result) => {
					if(err) return next(err);
					res.json({
						error: false,
						message: "Device Data found successfully.",
						data: result.docs
					})
				});
			});


		// to find device data total size, url: /api/device-data/get-total-size
		router.route('/get-total-size')
			.get(auth.authenticate, Device.authorize("reader"), function(req, res, next) {
				var device_id = parseInt(req.query.device_id)
				DeviceData.getAverageSize(device_id, (err, averageSize) => {
					if(err) return next(err);
					DeviceData.count({device_id: device_id}, (err, count) => {
						if(err) return next(err);
					    var totalSize = ((count*averageSize)/(1024*1024)).toFixed(2);
					    res.json({
							error: false,
							message: "Device Data total size fetched successfully.",
							data: totalSize
						})
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
