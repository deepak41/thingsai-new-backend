var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;

module.exports = function(passport) {
	var opts = {};
	opts.jwtFromRequest = ExtractJwt.fromExtractors([ExtractJwt.fromAuthHeaderAsBearerToken()]);
	opts.secretOrKey = nconf.get('secret');
	passport.use(new JwtStrategy(opts, function(jwt_payload, callback) {
		callback(jwt_payload);
	}));
};