export default function validateSchemaMiddleware(schema) {
  return (req, res, next) => {
    const validation = schema.validate(req.body);
    const error = validation.error;
    if (error) {
      console.log(error);
      return res.sendStatus(400);
    }

    next();
  };
}
