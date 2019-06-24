var User = require("../models/users");

module.exports = function (router) {

    // This will handle the url calls for /api/sessions
    router.route('/')
       .post(function (req, res, next) {

            User.findOne({email: req.body.email}).then(function (user) {
                if (!user) {
                    next({
                        status: 401,
                        message: messages.httpCodes(401)
                    })

                } else {
                    user.comparePassword(req.body.password, function (err, isMatch) {
                        if(isMatch && !err) {

                            var token = auth.signToken(user._id);
                            res.json({
                                error: false,
                                token: 'Bearer ' + token,
                                data: user
                            });
                        } else {
                            next({
                                status: 401,
                                message: messages.httpCodes(401)
                            })

                        }

                    });
                }

            }, function (err) {
                next(err)
            })

        });
}
