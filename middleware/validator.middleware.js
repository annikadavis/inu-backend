const Joi = require("joi");

const options = {
  abortEarly: false, // include all errors
  allowUnknown: true, // ignore unknown props
  stripUnknown: true, // remove unknown props
};

const createUserSchema = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().required(),
  repeatPassword: Joi.any()
    .equal(Joi.ref("password"))
    .required()
    .label("Confirm password")
    .messages({ "any.only": "{{#label}} does not match" }),
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
});

exports.createUserValidator = (req, res, next) => {
  const { error, value } = createUserSchema.validate(req.body, options);

  if (error) {
    return res.status(400).json({ errors: error.details });
  } else {
    // on success replace req.body with validated value and trigger next middleware function
    req.body = value;
    next();
  }
};
