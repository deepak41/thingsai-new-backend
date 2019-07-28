var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SlaveTypeSchema = new Schema({
	slave_type_id: {
		type: String,
		required: [true, 'slave type id field is required'],
		unique: true
	},
	name: {
		type: String,
		required: false,
		default: "Enter slave name"
	},
	owner: {
		type: String
	},
	energy: {
		type: Schema.Types.Mixed,
		required: false,
		default: {}
	},
	props: {
		type: [Schema.Types.Mixed],
		required: false
	}
}, {timestamps: true});

SlaveTypeSchema.methods.toJSON = function() {
	var obj = this.toObject()
	delete obj.__v
	return obj
}

const SlaveType = mongoose.model('slavetypes', SlaveTypeSchema, 'slavetypes');
module.exports = SlaveType;


SlaveType.authorize = function(req, res, next) {

	var slave_type_id = req.query.slave_type_id || req.body.type;

	SlaveType.findOne({slave_type_id: slave_type_id}, (err, slave) => {
		if(err) return next(err);
		if(!slave || slave.owner != res.locals.userInfo.email) return next({
            status: 403,
            message: "Access to this slave is denied!"
        });
		res.locals.slave = slave;
		next();
	});	
};
