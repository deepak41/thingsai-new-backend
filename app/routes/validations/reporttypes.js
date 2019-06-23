var Joi = require('joi');

module.exports = {
	
	lineDaily: {
		query: {
			site_id: Joi.number().integer().required(),
			start_ts: Joi.required(),
			end_ts: Joi.required()			
		}
	},

	addNewReport: {
		body: {
			freq: Joi.string().required().valid('daily', 'monthly', 'yearly'),
			report_name: Joi.required()	
		}
	}

};