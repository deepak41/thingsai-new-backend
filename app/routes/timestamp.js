module.exports = function(router) {

	router.route('/')
		.get(function(req, res, next) {
			var ts = Math.floor(Date.now()/1000);
			// res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
			return res.json({
				error: false,
				message: "Timestamp fetched successfully!",
				data: ts
			})
		})

}