var Books = require("../models/books");

module.exports = function(router) {
	'use strict';


		router.route('/test1')
			.get(/*auth.authenticate()*/ auth.verifyToken, function(req, res, next) {

				console.log("------------------------TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT");
				console.log(res.locals.userInfo)

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


		router.route('/idtoken')
			.post(function(req, res, next) {

				var idToken = req.body.idToken

				fadmin.auth().verifyIdToken(idToken)
				  .then(function(decodedToken) {
				  	console.log("77777777777777777777777777")
				  	console.log(decodedToken);
				    let uid = decodedToken.uid;
				    // ...
				  }).catch(function(error) {
				    // Handle error
				    console.log("fffffffffffffffffffffffffffffffff")
				    console.log(error)
				  });

				res.status(200);
				res.json({
					error: false,
					message: "working right",
					data: null
				});

			});


		router.route('/logout')
			.get(function(req, res, next) {

				console.log("==================================")

				var key = "Essdp2nsKCezHWgF5P8bnRNn86D3";
				  // let del_ref = admin.database().ref("product/" + key);
				  // var ref = fdb.ref("/users/" + key);
				  // console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk")
				  // ref.remove()
				  //   .then(function(data) {
				  //   	console.log(data)
				  //     res.send({ status: 'ok' });
				  //   })
				  //   .catch(function(error) {
				  //   	console.log("444444444444444444444444444444");
				  //     console.log('Error deleting data:', error);
				  //     res.send({ status: 'error', error: error });
				  //   });

				    var jobskill_query = fdb.collection('users').doc(key).delete();
						

						res.status(200);
				res.json({
					error: false,
					message: "working right",
					data: null
				});

			});
}



