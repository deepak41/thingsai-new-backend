var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var jsonSize = require('json-size');


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
	delete obj._id
	delete obj.__v
	delete obj.updatedAt
	return obj
}

const DeviceData = mongoose.model('devicedata', DeviceDataSchema, 'devicedata');
module.exports = DeviceData;


DeviceData.getAverageSize = function(device_id, callback) {
	DeviceData.aggregate([
	   	{$match: {device_id: device_id}},
    	{$sample: {size: 10}}
	], function(err, docs){
		if(err) return callback(err, null);
		var size = 0;
		docs.forEach(function(data) {						
			size = size + jsonSize(data); 
		});
		var averageSize = Math.floor(size/10);
		callback(null, averageSize);
	});	
}



