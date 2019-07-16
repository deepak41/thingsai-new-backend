var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SlaveSchema = new Schema({
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

SlaveSchema.methods.toJSON = function() {
	var obj = this.toObject()
	delete obj.__v
	return obj
}

const Slave = mongoose.model('slaves', SlaveSchema, 'slaves');
module.exports = Slave;
