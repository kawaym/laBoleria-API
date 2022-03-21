import joi from "joi";

const orderSchema = joi.object({
  clientId: joi.number().integer().positive().required(),
  cakeId: joi.number().integer().positive().required(),
  quantity: joi.number().integer().max(4).positive().required(),
  totalPrice: joi.number().positive().required(),
});

export default orderSchema;
