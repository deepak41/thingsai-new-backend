require('../config/helpers/passport')(passport);
var jwt = require('jsonwebtoken');
var User = require("../app/models/users");


exports.authenticate = function() {
	return passport.authenticate('jwt', {session: false})
};

exports.signToken = function(userId) {

	var token = jwt.sign(
		{user: userId }, 
		nconf.get('secret'),
		{expiresIn: 60*60}
	);

	return token;
};

exports.verifyToken = function(req, res, next) {
	var token = req.headers.authorization;
	if(!token) return next("err");

	var parted = token.split(' ');
	if (parted.length === 2) {
		jwt.verify(parted[1], nconf.get('secret'), function(err, decoded) {
			if(err) return next({
				message: err.name + " " + err.message,
				status: 401
			});

			User.getFull(decoded.user, function(err, user) {
				user = user.toObject();
				delete user.password;
				delete user.__v;

				res.locals.userInfo = user;
				next();
			}); 
		});
	}
};


exports.verifyFireBaseToken = function(idToken, callback) {

	fadmin.auth().verifyIdToken(idToken).then(function(decodedToken) {
		callback(null, decodedToken);
	})
	.catch(function(error) {
		callback(error, null)
	});
};


