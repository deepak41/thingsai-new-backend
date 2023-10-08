const Joi = require('@hapi/joi');


module.exports = {
	
	addProps: [
		validate.body(Joi.object({
			name: Joi.string().required(),
			type: Joi.string().required().valid('integer', 'decimal', 'string', 'boolean'),
			comment: Joi.string()
		})), 
		validate.query(Joi.object({
			slave_type_id: Joi.string().required()
		}))
	],

	updateProps: [
		validate.body(Joi.object({
			name: Joi.string(),
			type: Joi.string().valid('integer', 'decimal', 'string', 'boolean'),
			comment: Joi.string()
		})), 
		validate.query(Joi.object({
			slave_type_id: Joi.string().required(),
			propName: Joi.string().required()
		}))
	]

};

