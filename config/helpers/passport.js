var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
// var User = require('../../app/models/user');

module.exports = function(passport) {
	var opts = {};
	opts.jwtFromRequest = ExtractJwt.fromExtractors([ExtractJwt.fromAuthHeaderAsBearerToken()]);
	opts.secretOrKey = config.get('secret');

	passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
		done(null, jwt_payload);
	}));
};