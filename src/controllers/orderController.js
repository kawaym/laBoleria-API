import dayjs from "dayjs";
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
          orders("clientId", "cakeId", quantity, "totalPrice", "createdAt")
        VALUES($1, $2, $3, $4, $5)
      `,
      [
        clientId,
        cakeId,
        quantity,
        totalPrice * 100,
        dayjs().format("YYYY-MM-DD HH:mm"),
      ]
    );
    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function readOrders(req, res) {
  const { date } = req.query;
  let dateQuery = "";
  if (date && dayjs(date).isValid()) {
    dateQuery = `WHERE o."createdAt"='${date}'`;
  }
  try {
    const orders = (
      await connection.query(
        `
        SELECT o."clientId", o."cakeId", o.quantity, o."createdAt", o."totalPrice"
        FROM orders o
        ${dateQuery}
        `
      )
    ).rows;
    const completeOrders = Promise.all(
      orders.map(async (item) => {
        const client = (
          await connection.query(
            `
        SELECT * FROM clients
        WHERE clients.id=$1  
        `,
            [item.clientId]
          )
        ).rows[0];
        const cake = (
          await connection.query(
            `
              SELECT * FROM cakes
              WHERE cakes.id=$1
            `,
            [item.cakeId]
          )
        ).rows[0];
        delete item.clientId;
        delete item.cakeId;
        return {
          client: client,
          cake: cake,
          createdAt: dayjs(item.createdAt).format("YYYY-MM-DD HH:mm"),
          quantity: parseInt(item.quantity),
          totalPrice: parseFloat(item.totalPrice / 100),
        };
      })
    );
    completeOrders.then((result) => {
      if (result[0] === undefined) {
        res.status(404).send([]);
        return;
      } else {
        res.status(200).send(result);
        return;
      }
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
