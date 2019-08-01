var SlaveType = require("../models/slave-types");
var User = require("../models/users");

module.exports = function(router) {
	'use strict';

		// to find a slave, url: /api/slave-types
		router.route('/')
			.get(auth.authenticate, SlaveType.authorize, function(req, res, next) {
				res.json({
					error: false,
					message: "Slave found successfully.",
					data: res.locals.slave
				});	
			})

			// to create a new slave.
			.post(auth.authenticate, function(req, res, next) {
				req.body.owner = res.locals.userInfo.email;
				req.body.slave_type_id = randomstring.generate(26);
				SlaveType.create(req.body, (err, slaveType) => {
				    if(err) return next(err);
					res.json({
						error: false,
						message: "Slave created successfully.",
						data: slaveType
					})
			    })
			})

			// to update a slave.
			.put(auth.authenticate, SlaveType.authorize, function(req, res, next) {
				SlaveType.findOneAndUpdate({slave_type_id: req.query.slave_type_id}, req.body, {new: true}, (err, doc) => {
					if(err) return next(err);
					res.json({
						error: false,
						message: "Slave updated successfully.",
						data: doc
					})
				});	
			})

			// to delete a slave.
			.delete(auth.authenticate, SlaveType.authorize, function(req, res, next) {
				SlaveType.findOneAndRemove({slave_type_id: req.query.slave_type_id}, (err, slave) => {
					if(!slave) return next("err");
					res.json({
						error: false,
						message: "Slave deleted successfully.",
						data: slave.name
					});
				});												
			});


		// to get all slaves of a user, url: /api/slave-types/user-slaves
		router.route('/user-slaves')
			.get(auth.authenticate, function(req, res, next) {
				SlaveType.find({owner: res.locals.userInfo.email}, (err, slaves) => {
					if(err) return next(err);
					res.json({
						error: false,
						message: "Slaves found successfully!",
						data: slaves
					});
				})
			});


		router.route('/create-by-admin')
			.post(function(req, res, next) {
				SlaveType.create(req.body, (err, slaveType) => {
				    if(err) return next(err);
					return res.json({
						error: false,
						message: "Slave created successfully.",
						data: slaveType
					})
			    })
			})
	
}
