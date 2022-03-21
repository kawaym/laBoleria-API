import connection from "../db.js";

export async function createOrder(req, res) {
  const { clientId, cakeId, quantity, totalPrice } = req.body;

  try {
    const clientExists =
      (
        await connection.query(
          `
      SELECT * FROM clients
      WHERE clients.id=$1
    `,
          [clientId]
        )
      ).rows.length > 0;
    const cakeExists =
      (
        await connection.query(
          `
        SELECT * FROM cakes
        WHERE cakes.id=$1
      `,
          [cakeId]
        )
      ).rows.length > 0;
    if (!clientExists || !cakeExists) {
      res.sendStatus(404);
      return;
    }
    await connection.query(
      `
        INSERT INTO
          orders("clientId", "cakeId", quantity, "totalPrice")
        VALUES($1, $2, $3, $4)
      `,
      [clientId, cakeId, quantity, totalPrice]
    );
    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
