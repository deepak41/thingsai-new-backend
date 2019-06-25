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


	// for getting users, url /api/users/
	router.route('/')
		.get(function(req, res, next) {

			var query = {};
			if(req.body.email) {
				query = {name: req.body.email};
			}

			User.find(query, function(err, user) {
			    if (err) return res.status(500).send(err);   
			    return res.status(200).send(user);
			});

			
		});

	// for updating user, url /api/users/
	router.route('/')
		.put(function(req, res, next) {

			  User.findOne({email: req.body.email}, function(err, user) {
			    if (err) return res.status(500).send(err);
			    	user.password = "hello"

					user.save(function(err) {
						if (err) return next(err);
						return res.status(200).send(user);
					});

			});

			  
			
		});

};