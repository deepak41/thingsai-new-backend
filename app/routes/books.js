var Books = require("../models/books");

module.exports = function(router) {
	'use strict';


		router.route('/test1')
			.get(function(req, res, next) {

				res.status(200);
				res.json({
					error: false,
					message: "working right",
					data: null
				});

			});


		router.route('/')
		    .post(function(req, res, next) {

				Books.create(req.body, function(err, record) {

					if(err) return next(err);

					// var message = record.email + " is successfully subscribed for " + record.freq + " reports for site id " + record.site_id;
					// callback(err, record, message);		

					res.status(200);
					res.json({
						error: false,
						message: "Subscriptions found successfully",
						data: record
					});
				});
		    })

}



