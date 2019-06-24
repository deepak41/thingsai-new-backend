var User = require("../models/users");
var async = require('async');


module.exports = function(router) {
	'use strict';

	// for creating a new user, url /api/users/
	router.route('/')
		.post(function(req, res, next) {

			var newUser = new User({
				email: req.body.email,
				password: req.body.password,
				name: req.body.name
			});

			newUser.save(function(err) {
				if (err) return next(err);
				return res.status(200).send(newUser);
			});
		});

};