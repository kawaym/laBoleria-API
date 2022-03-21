export default function validateSchemaMiddleware(schema) {
  return (req, res, next) => {
    const validation = schema.validate(req.body);
    const error = validation.error?.details[0].type;
    if (error === "string.uri") {
      return res.sendStatus(422);
    } else if (error) {
      return res.sendStatus(400);
    }

    next();
  };
}
