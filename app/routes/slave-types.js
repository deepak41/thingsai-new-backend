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


		// to add a new property, url: /api/slave-types/props
		router.route('/props')
			.post(auth.authenticate, SlaveType.authorize, function(req, res, next) {
				var newProp = {
					name: req.body.name,
					type: req.body.type,
					comment: req.body.comment
				};
				newProp = JSON.parse(JSON.stringify(newProp));
				SlaveType.findOne({slave_type_id: req.query.slave_type_id}, (err, slaveType) => {
					var prop = slaveType.props.find(obj => obj.name == newProp.name);
					if(prop) return next({
						status: 404,
						message: "Property with this name already exists!"
					});
					slaveType.props = slaveType.props.concat([newProp]);
					slaveType.save((err, slaveType) => {
						if(err) return next(err);
						return res.json({
							error: false,
							message: "Slave property added successfully.",
							data: slaveType.props
						})
					});
				})
			})

			// to delete a property
			.delete(auth.authenticate, SlaveType.authorize, function(req, res, next) {
				SlaveType.findOne({slave_type_id: req.query.slave_type_id}, (err, slaveType) => {
					var prop = slaveType.props.find((obj, index) => {
					    if(obj.name == req.query.propName) {
					        slaveType.props.splice(index, 1);
					        return true; // stop searching
					    }
					});
					if(prop == undefined) return next({
						status: 404,
		                message: "Property is invalid!"
					})
					slaveType.save((err, slaveType) => {
						if(err) return next(err);
						return res.json({
							error: false,
							message: "Slave property deleted successfully.",
							data: slaveType.props
						})
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
