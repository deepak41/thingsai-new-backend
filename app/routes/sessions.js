var User = require("../models/users");

module.exports = function (router) {

    // This will handle the url calls for /api/sessions
    router.route('/')
       .post(function (req, res, next) {
            User.findOne({email: req.body.email}).then(function(user) {
                if (!user) return next({
                    status: 401,
                    message: "Invalid email or password!"
                });
                user.comparePassword(req.body.password, function (err, isMatch) {
                    if(isMatch && !err) {
                        var token = auth.signToken(user._id);
                        res.json({
                            error: false,
                            token: token,
                            data: user
                        });
                    } 
                    else {
                        next({
                            status: 401,
                            message: "Invalid email or password!"
                        })
                    }
                });
            }, 
            function (err) {
                next(err)
            })
        });


    // This will handle the url calls for /api/sessions/firebaselogin
    router.route('/firebaselogin')
       .post(function (req, res, next) {
            auth.verifyFireBaseToken(req.body.idToken, function(err, user) {
                if(err) return next({
                    status: 401,
                    message: "Invalid email or password!"
                });
                User.findOne({email: user.email}).then(function(user) {
                    if (!user) return next({
                        status: 401,
                        message: "Invalid email or password!"
                    });
                    var token = auth.signToken(user._id);
                    res.json({
                        error: false,
                        token: token,
                        data: user
                    });
                })                
            })
        });

}
