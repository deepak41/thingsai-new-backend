var User = require("../models/users");
var async = require('async');


module.exports = function(router) {
	'use strict';

	// for creating a new user, url /api/users/
	router.route('/')
		.post(function(req, res, next) {
			var newUser = {
				email: req.body.email,
				password: req.body.password,
				name: req.body.name,
				phone_no: req.body.phone_no,
				user_image: req.body.user_image
			};
			newUser = JSON.parse(JSON.stringify(newUser));
			User.create(newUser, (err, doc) => {
				if(err && err.code == 11000) return next({
	                status: 409,
	                message: "Email is already registered!",
	                email: newUser.email
	            });
				if (err) return next(err);
				return res.json({
					error: false,
					message: "User registered successfully!",
					data: doc
				})
			})
		});


	// for getting users, url /api/users/
	router.route('/')
		.get(function(req, res, next) {

			var query = {};
			if(req.body.email) {
				query = {name: req.body.email};
			}

			User.find(query, (err, user) => {
			    if (err) return res.status(500).send(err);   
			    return res.status(200).json(user);
			});

			
		});

	// to update a user, url /api/users/
	router.route('/')
		.put(auth.authenticate, function(req, res, next) {
			var input = {
				name: req.body.name,
				phone_no: req.body.phone_no,
				user_image: req.body.user_image
			};
			input = JSON.parse(JSON.stringify(input));
			if(Object.keys(input).length == 0) return next({
				status: 400,
	            message: "Request body is illegal!"
	        });
			User.findOneAndUpdate({email: res.locals.userInfo.email}, input, {new: true}, (err, doc) => {
				if(err) return next(err);
				if(!doc) return next({
	                status: 404,
	                message: "No account with that email address exists!"
	            });
				return res.json({
					error: false,
					message: "User updated successfully.",
					data: doc
				})
			});		
		});


	router.route('/update-by-admin')
		.put(function(req, res, next) {
			User.findOneAndUpdate({email: req.query.email}, req.body, (err, doc) => {
				if (err) return next(err);
				return res.json({
					error: false,
					message: "User updated successfully."
				})
			});		
		});


	// for sending password reset mail, url /api/users/password/forgot
	router.route('/password/forgot')
		.post(function(req, res, next) {

			async.waterfall([
				function(callback) {
					var rpToken = randomstring.generate(35);
					callback(null, rpToken);
				},
				function(rpToken, callback) {
					User.findOne({email: req.body.email}, (err, user) => {
						if(err) return next(err);
						if (!user) return next({
							status: 404,
							message: "No account with that email address exists."
						});
						user.resetPasswordToken = rpToken;
						user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

						user.save((err) => {
							callback(err, rpToken, user);
						});
					});
				},
				function(rpToken, user, callback) {
					Utils.sendPasswordResetMail(rpToken, user.email, user.name, (err, result) => {
						var data = {
							email: user.email,
							apimessage: result,
							message: "Password reset email has been successfully sent to " + user.email
						};
						callback(err, data)
					})
				}],
				function(err, result) {
					if (err) return next(err);
					res.json({
						error: false,
						message: result.message,
						data: result
					});
			});
		});


	// for resetting the password, url /api/users/password/reset/{token}
	router.route('/password/reset/:token')
		.get(function(req, res, next) {
			User.findOne({
				resetPasswordToken: req.params.token,
				resetPasswordExpires: {$gt: Date.now()}
			}, (err, user) => {
				if (err) return next(err);
				if (!user) return next({
					status: 400,
					message: "The link is either invalid or has expired."
				});
				res.json({
					error: false,
					message: "The link is active."
				});
			});

		})
		.post(function(req, res, next) {
			User.findOne({
				resetPasswordToken: req.params.token,
				resetPasswordExpires: {$gt: Date.now()}
			}, (err, user) => {
				if (err) return next(err);
				if (!user) return next({
					status: 400,
					message: "The link is either invalid or has expired."
				});
				user.password = req.body.password;
				user.resetPasswordToken = undefined;
				user.resetPasswordExpires = undefined;
				user.save((err) => {
					if (err) next(err);
					res.json({
						error: false,
						message: "Password has been changed successfully."
					})
				});
			});
		});

};