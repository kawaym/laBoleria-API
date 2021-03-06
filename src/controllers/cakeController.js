import connection from "../db.js";

export async function createCake(req, res) {
  const { name, price, image, description } = req.body;
  try {
    const cakeExists =
      (
        await connection.query(
          `
        SELECT * FROM cakes
        WHERE cakes.name=$1
      `,
          [name]
        )
      ).rows.length > 0;
    if (cakeExists) {
      res.sendStatus(409);
      return;
    }
    await connection.query(
      `
      INSERT INTO 
        cakes(name, price, image, description)
      VALUES($1, $2, $3, $4)
    `,
      [name, price, image, description]
    );
    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
