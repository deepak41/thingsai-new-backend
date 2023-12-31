var User = require("../models/users");

module.exports = function(router) {

    // This will handle the url calls for /api/sessions
    router.route('/')
       .post(function (req, res, next) {
            User.findOne({email: req.body.email}, (err, user) => {                
                if(!user) return next({
                    status: 401,
                    message: "Invalid email or password!"
                });
                user.comparePassword(req.body.password, (err, isMatch) => {
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
            });
        });


    // This will handle the url calls for /api/sessions/firebaselogin
    router.route('/firebaselogin')
       .post(function (req, res, next) {
            auth.verifyFirebaseToken(req.body.idToken, (err, fbuser) => {
                if(err) return next({
                    status: 401,
                    message: "Firebase token is invalid!"
                });
                User.findOne({email: fbuser.email}, (err, user) => {
                    if(user) {
                        var token = auth.signToken(user._id);
                        res.json({
                            error: false,
                            token: token,
                            data: user
                        });
                    }
                    else {
                        var newUser = {
                            email: fbuser.email,
                            name: fbuser.name
                        };
                        User.create(newUser, (err, doc) => {
                            if(err) return next(err);
                            var token = auth.signToken(doc._id);
                            res.json({
                                error: false,
                                token: token,
                                data: doc
                            });
                        })
                    }
                });
            })
        });


    // This will handle the url calls for /api/sessions/verify-token
    router.route('/verify-token')
       .post(auth.authenticate, function (req, res, next) {
           res.json({
               error: false,
               message: "Token is valid",
               data: null
           })
        });

}
