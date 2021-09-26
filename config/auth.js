var passport = require('passport');
require('../config/helpers/passport')(passport);
var jwt = require('jsonwebtoken');
var User = require("../app/models/users");


exports.authenticate = function(req, res, next) {
	passport.authenticate('jwt', {session: false}, (data) => {


		console.log("99999999999999999999999999999")
		console.log(data)

		if(!data) return next({
			status: 401,
            message: "Authorisation token is invalid or expired!"
		});
		User.getFull(data.user, (err, user) => {
			if(!user) return next({
				status: 401,
                message: "Authorisation token is invalid or expired!"
			});
			User.updateLastActive(user.email);
			res.locals.userInfo = user;
			next();
		});
	})(req, res);
};

exports.signToken = function(userId) {
	var token = 'Bearer ' + jwt.sign(
		{token_data: {
				user_id: userId,

			}
		}, 
		nconf.get('secret'),
		{expiresIn: 60*60*24}
	);
	return token;
};

exports.signToken2 = function(userId) {
	var token = 'Bearer ' + jwt.sign(
		{user: userId}, 
		nconf.get('secret'),
		{expiresIn: 60*60*24}
	);
	return token;
};

exports.verifyFirebaseToken = function(idToken, callback) {
	fadmin.auth().verifyIdToken(idToken).then(function(decodedToken) {
		callback(null, decodedToken);
	})
	.catch(function(error) {
		callback(error, null)
	});
};


