var messages = {

}

messages.deviceData = {
    //Messages for [POST] /api/device-data
    post: {
        device_id: "Enter a valid device id. Only Whole Numbers",
        slave_id: "Enter a valid slave id. Only Whole Numbers",
        site_id: "Enter a valid site id. Only Whole Numbers",
        dts: "Invalid Device Time Stamp in milliseconds",
        data: "Data filed should be JSON"
    }
};

//Messages for [POST] /api/users
messages.users = {
    post: {
        email: "Enter a valid email address.",
        name: "Please Use atleat 3 characters for name",
        password: "Password Lenght should be between 6 and 15",
        role: "Role can be 1, 2 or 3"
    }
};

// Messages for /api/devices

messages.devices = function (err) {

    if(err.errors) {
        if(err.errors.slaves.message) {
            return err.errors.slaves.message;
        }
    }
    else if(err.errmsg) {
        return err.errmsg;
    }
    else {
        return err
    }

};

// messages.devices = {
//     post: {
//         email: "Enter a valid email address.",
        
//     }
// };

//Messages for Status Codes
messages.httpCodes = function (code) {
    var msg = null;
    switch (code) {
        case 403:
            msg = 'You have no right to update this resource.';
            break;
        case 404:
            msg = 'Resource Not Found.';
            break;
        case 401:
            msg = 'Authentication failed.User not found.';
            break;
        case 406:
            msg = 'Please Use a Query. Data will be too large.'
            break;
        default:
            msg = "There was some error.";
    }
    return msg;

}

module.exports = messages;
