import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
    MONGODB_URI: Joi.required(),
    PORT: Joi.number().default(3000),
    DEFAULT_LIMIT: Joi.number().default(10),
});