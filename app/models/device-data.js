var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');


var DeviceDataSchema = new mongoose.Schema({
	device_id: {
		type: Number,
		required: [true, 'Device id field is required']
	},
	slave_id: {
		type: Number,
		required: true
	},
	data: {
		type: Object,
		required: true
	},
	by_user: {
		type: String,
		required: true
	},
	ts: {
		type: Number,
		default: parseInt(Date.now() / 1000)
	}
}, {timestamps: true});

DeviceDataSchema.plugin(mongoosePaginate);

DeviceDataSchema.methods.toJSON = function() {
	var obj = this.toObject()
	delete obj.__v
	return obj
}

const DeviceData = mongoose.model('devicedata', DeviceDataSchema, 'devicedata');
module.exports = DeviceData;



