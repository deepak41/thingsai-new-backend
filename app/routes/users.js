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
				return res.status(200).json(newUser);
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
			    return res.status(200).json(user);
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
						return res.status(200).json(user);
					});

			});

			  
			
		});


	router.route('/password/forgot')
		.post(function(req, res, next) {

			async.waterfall([
				function(callback) {
					var rpToken = randomstring.generate(35);
					callback(null, rpToken);
				},
				function(rpToken, callback) {
					User.findOne({email: req.body.email}, function(err, user) {
						if(err) return next(err);
						if (!user) {
							res.json({
								error: true,
								message: "No account with that email address exists."
							});
						}
						user.resetPasswordToken = rpToken;
						user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

						user.save(function(err) {
							callback(err, rpToken, user);
						});
					});
				},
				function(rpToken, user, callback) {
						Utils.sendMail(rpToken, user.email, user.name, function(err, result) {
							if(err) return next(err);
							var data = {
								message: "An email has been sent to " + user.email + ". Please Check!",
								data: {"email": user.email},
								apimessage: result
							};
							callback(err, data)
						})
				}],
				function(err, result) {
					if (err) return next(err);
					res.json({
						error: false,
						data: result
					});
			});
	});



	router.route('/password/reset/:token')
		.get(function(req, res, next) {
			User.findOne({
				resetPasswordToken: req.params.token,
				resetPasswordExpires: {
					$gt: Date.now()
				}
			}, function(err, user) {
				if (err) return next(err);

				if (!user) {
					res.json({
						error: true,
						message: "The link is either invalid or has expired."
					});
				}
				res.json({
					error: false,
					message: "The link is active."
				});
			});

		})
		.post(function(req, res, next) {
			User.findOne({
				resetPasswordToken: req.params.token,
				resetPasswordExpires: {
					$gt: Date.now()
				}
			}, function(err, user) {
				if (err) return next(err);

				if (!user) {

					res.json({
						error: true,
						message: "The link is either invalid or has expired."
					});
				} else {
					user.password = req.body.password;
					user.resetPasswordToken = undefined;
					user.resetPasswordExpires = undefined;
					user.save(function(err) {
						if (err) next(err);
						res.json({
							error: false,
							message: "Password has been changed successfully."
						})

					});
				}
			});

	});

};