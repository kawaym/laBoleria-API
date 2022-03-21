import joi from "joi";

const clientSchema = joi.object({
  name: joi.string().required(),
  address: joi.string().min(5).required(),
  phone: joi.string().min(10).max(11).required(),
});

export default clientSchema;
