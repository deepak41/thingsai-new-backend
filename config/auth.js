var passport = require('passport');
require('../config/helpers/passport')(passport);
var jwt = require('jsonwebtoken');
var User = require("../app/models/users");


exports.authenticate = function(req, res, next) {
	passport.authenticate('jwt', {session: false}, (data) => {
		if(!data) return next({
			status: 401,
            message: "Token is invalid!"
		});
		User.getFull(data.user, function(err, user) {
			if(!user) return next({
				status: 401,
                message: "No user found!"
			});
			res.locals.userInfo = user;
			next();
		});
	})(req, res);
};

exports.signToken = function(userId) {
	var token = 'Bearer ' + jwt.sign(
		{user: userId }, 
		nconf.get('secret'),
		{expiresIn: 60*60}
	);
	return token;
};


exports.verifyFireBaseToken = function(idToken, callback) {

	fadmin.auth().verifyIdToken(idToken).then(function(decodedToken) {
		callback(null, decodedToken);
	})
	.catch(function(error) {
		callback(error, null)
	});
};


