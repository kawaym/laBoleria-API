import joi from "joi";

const cakeSchema = joi.object({
  name: joi.string().min(2).required(),
  price: joi.number().positive().required(),
  description: joi.string().allow(""),
  image: joi.string().uri().required(),
});

export default cakeSchema;
