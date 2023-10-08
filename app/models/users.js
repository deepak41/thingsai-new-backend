var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');


var UserSchema = new Schema({
	email: {
		type: String,
		unique: [true, 'Email Already Exists'],
		required: [true, 'Email field is required']
	},
	password: {
		type: String
	},
	name: {
		type: String,
		required: [true, 'Name field is required']
	},
	phone_no: {
		type: Number,
		default: null
	},
	last_active: {
		type: Number,
		default: parseInt(Date.now() / 1000)
	},
	user_image: {
	    type: String,
	    default: 'Add an image'
	},
	is_verified: {
		type: Number,
		default: 1
	},
	devices : { 
		type : Array , 
		"default" : [] 
	},
	resetPasswordToken: String,
	resetPasswordExpires: Date
	
}, {timestamps: true});

UserSchema.pre('save', function(next) {
	var user = this;
	if(!user.password) return next()
	if (this.isModified('password') || this.isNew) {
		bcrypt.genSalt(10, (err, salt) => {
			if(err) return next(err);
			bcrypt.hash(user.password, salt, (err, hash) => {
				if(err) return next(err);
				user.password = hash;
				next();
			});
		});
	} else {
		return next("document not found");
	}
});

UserSchema.methods.comparePassword = function(passw, cb) {
	bcrypt.compare(passw, this.password, (err, isMatch) => {
		cb(err, isMatch);
	});
};

UserSchema.methods.toJSON = function() {
	var obj = this.toObject();
	delete obj._id
	delete obj.__v
	delete obj.password
	delete obj.devices
	delete obj.last_active
	delete obj.resetPasswordToken
	delete obj.resetPasswordExpires
	return obj
};


const User = mongoose.model('users', UserSchema, 'users');
module.exports = User;


User.getFull = function(id, callback) {
	User.findOne({_id: id}, (err, user) => {
		if(!user) return callback(err, user); 
		user = user.toObject()
		delete user.password;
		delete user.__v;
		delete user.resetPasswordExpires
		delete user.resetPasswordToken
		return callback(err, user)
	});
}

User.updateLastActive = function(email) {
	User.findOneAndUpdate({email: email}, {last_active: parseInt(Date.now()/1000)}, (err, doc) => {
		return doc;		
	});	
}

