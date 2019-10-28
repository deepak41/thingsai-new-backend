var mongoose = require('mongoose');


var DeviceSchema = new mongoose.Schema({
	device_id: {
		type: Number,
		required: [true, 'Device id field is required'],
		unique: true
	},
	name: {
		type: String,
		required: false,
		default: "Device Name"
	},
	slaves : { 
		type : Array , 
		"default" : [] 
	},

}, {timestamps: true});

DeviceSchema.methods.toJSON = function() {
	var obj = this.toObject()
	delete obj.__v
	delete obj._id
	return obj
}

const Device = mongoose.model('devices', DeviceSchema, 'devices');
module.exports = Device;


Device.authorize = function(requiredRole) {
	return [
        (req, res, next) => {
        	var arr = res.locals.userInfo.devices;
        	var device_id = req.query.device_id || req.body.device_id;
        	var device = arr.find(obj => obj.device_id == device_id);
			if(!device) return next({
				status: 403,
				message: "Access to this device is denied!",
				device_id: device_id
			});
            if(requiredRole == "reader") {
            	next()
            }
            else if(requiredRole == "writer" && ["owner", "writer"].includes(device.role)) {
            	next()
            }
            else if(requiredRole == "owner" && device.role == "owner") {
            	next()
            }
            else  next({
				status: 403,
				message: "You don't have the required permissions!",
				device_id: device_id
			});
        }
    ];
}

Device.checkSlave = function(req, res, next) {
	var slave_id = req.body.slave_id || req.query.slave_id;
	var device_id = req.body.device_id || req.query.device_id;
	Device.findOne({device_id: device_id}, (err, device) => {
		if(err) return next(err);
		var slave = device.slaves.find(obj => obj.slave_id == slave_id);
		if(!slave) return next({
			status: 404,
			message: "Slave with this id doesn't exist!",
			device_id: slave_id
		});
		next();	
	});	
};