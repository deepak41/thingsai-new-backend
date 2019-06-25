var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');


var UserSchema = new Schema({
	email: {
		type: String,
		unique: [true, 'Email Already Exists'],
		required: [true, 'Email field is required']
	},
	password: {
		type: String,
		required: [true, 'Password field is required']
	},
	name: {
		type: String,
		required: false,
		default: "Enter your name"
	},
	phone_no: {
		type: Number,
		default: 0
	},
	user_image: {
	    type: String,
	    default: 'Add an image'
	},
	is_verified: {
		type: Number,
		default: 0,
		required: true
	},
	devices : { 
		type : Array , 
		"default" : [] 
	}
	
});

UserSchema.pre('save', function(next) {

	var user = this;
	if (this.isModified('password') || this.isNew) {
		bcrypt.genSalt(10, function(err, salt) {
			if (err) return next(err);
			bcrypt.hash(user.password, salt, function(err, hash) {
				if (err) {
					return next(err);
				}
				user.password = hash;
				next();
			});
		});
	} else {
		return next("document not found");
	}
});

UserSchema.methods.comparePassword = function(passw, cb) {
	bcrypt.compare(passw, this.password, function(err, isMatch) {
		cb(err, isMatch);
	});
};


const User = mongoose.model('users', UserSchema, 'users');
module.exports = User;


User.getFull = function(id, callback) {

	User.findOne({_id: id}, function(err, user) { 
		return callback(err, user)
	});

}

