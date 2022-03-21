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
    let orderIdQuery = `
          SELECT o."clientId", o."cakeId", o.quantity, o."createdAt", o."totalPrice"
          FROM orders o
          ${dateQuery}
        `;
    const { id } = req.params;
    let idValid = false;
    if (id !== undefined) {
      if (isNaN(id)) {
        res.sendStatus(400);
        return;
      }
      const orderExists =
        (
          await connection.query(
            `
            SELECT * FROM orders
            WHERE orders.id=$1
            `,
            [id]
          )
        ).rows.length > 0;
      if (!orderExists) {
        res.sendStatus(404);
        return;
      }
      idValid = true;
      orderIdQuery = `
        SELECT o."clientId", o."cakeId", o.quantity, o."createdAt", o."totalPrice"
        FROM orders o
        WHERE o.id=${id}
      `;
    }

    const orders = (await connection.query(orderIdQuery)).rows;
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
        let cake = (
          await connection.query(
            `
              SELECT * FROM cakes
              WHERE cakes.id=$1
            `,
            [item.cakeId]
          )
        ).rows[0];
        cake = { ...cake, price: parseFloat(cake.price).toFixed(2) };
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
        if (idValid) {
          res.status(200).send(result[0]);
          return;
        }
        res.status(200).send(result);
        return;
      }
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function readOrdersByClient(req, res) {
  const { id } = req.params;

  try {
    const clientExists =
      (
        await connection.query(
          `
      SELECT * FROM clients
      WHERE clients.id=$1
    `,
          [id]
        )
      ).rows.length > 0;
    if (!clientExists) {
      res.sendStatus(404);
      return;
    }
    const orders = (
      await connection.query(
        `
        SELECT o.id as "orderId", o.quantity, o."createdAt", o."totalPrice", c.name AS "cakeName"
        FROM orders o
        JOIN cakes c ON o."cakeId"=c.id
        WHERE o."clientId"=${id}
      `
      )
    ).rows;
    const correctedOrders = orders.map((item) => {
      return {
        orderId: parseInt(item.orderId),
        quantity: parseInt(item.orderId),
        createdAt: dayjs(item.createOrder).format("YYYY-MM-DD HH:mm"),
        totalPrice: parseFloat(item.totalPrice) / 100,
        cakeName: item.cakeName,
      };
    });

    res.send(correctedOrders).status(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
