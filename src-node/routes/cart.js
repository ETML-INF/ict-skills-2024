import express from "express"
import { randomUUID } from "crypto";
import { handleAsync } from "../util.js";
import { executeQuery } from "../db.js";

const cartRouter = express();

// Example route that can be deleted or adapted.
// This can be called via GET http://localhost:4000/api/example/blubb
cartRouter.get(
  "/:var1",
  handleAsync(async (req, res, next) => {
    const results = await executeQuery(
      "SELECT 1 as id, 'example' as value WHERE 'example_param' = ?",
      ["example_param"]
    );
    res.send({
      foo: "bar",
      pathParam: req.params["var1"],
      uuid: randomUUID(),
      results,
    });
  })
);

cartRouter.post(
  "/", 
  handleAsync(async (req, res) => {
    const id = randomUUID();
    const results = await executeQuery(
      "INSERT INTO cart(id, status) VALUES (?, ?)", 
      [id, '201 Created']
    );
    res.status(201).send({ 
      cartId: id 
    })
  })
);

cartRouter.post(
  "/:id/items", 
  handleAsync(async (req, res) => {
    const results = await executeQuery(
      "SELECT * FROM cart WHERE id=?", 
      [req.params.id]
    );
    if(results[0] == undefined) {
      return res.status(404)
    }
    const product = await executeQuery(
      "INSERT INTO cart_item(cart_id, product_id, quantity) VALUES(?, ?, ?)", 
      [results[0].id, req.body.productId, req.body.quantity]
    );
    res.status(201);
  })
)

export { cartRouter };
