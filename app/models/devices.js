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
	return obj
}

const Device = mongoose.model('devices', DeviceSchema, 'devices');
module.exports = Device;


Device.authorize = function(requiredRole) {
	return [
        (req, res, next) => {
        	var arr = res.locals.userInfo.devices;
        	var device = arr.find(obj => obj.device_id == req.query.device_id);
			if(!device) return next({
				status: 403,
				message: "You dont't have permission to access this device!",
				device_id: req.query.device_id
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
				message: "You dont't have the required permission!",
				device_id: req.query.device_id
			});
        }
    ];
}