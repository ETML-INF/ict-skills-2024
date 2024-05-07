import express from "express"
import { randomUUID } from "crypto";
import { handleAsync } from "../util.js";
import { executeQuery } from "../db.js";

const cartRouter = express();

cartRouter.post(
  "/", 
  handleAsync(async (req, res, next) => {
    const id = randomUUID();
    await executeQuery(
      "INSERT INTO cart(id, status) VALUES (?, ?)", 
      [id, 'open']
    );
    res.status(201).send({ 
      cartId: id 
    });
  })
);

cartRouter.post(
  "/:id/items", 
  handleAsync(async (req, res, next) => {
    const cartId = req.params.id;
    const productId = req.body.productId;
    const quantity = req.body.quantity;

    const isProductNotExist = await executeQuery("SELECT * FROM product WHERE id=?;", [productId]) == '';
    const isCartNotExist = await executeQuery("SELECT * FROM cart WHERE id=?", [cartId]) == '';

    if(isCartNotExist || isProductNotExist) {
      return res.status(404)
    }

    if(quantity < 1) {
      return res.status(400)
    }

    await executeQuery("INSERT INTO cart_item(cart_id, product_id, quantity) VALUES (?, ?, ?)", [cartId, productId, quantity])

    res.status(201);
  })
);

cartRouter.put(
  "/:cardId/items/:productId", 
  handleAsync(async (req, res, next) => {
    const results = await executeQuery(
      "SELECT * FROM cart_item WHERE id=?",
      [req.params.productId]
    );

    if(results == '') {
      return res.status(404)
    }

    await executeQuery(
      "UPDATE cart_item SET quantity = ? WHERE cart_id=? AND product_id=?;",[req.body.quantity, req.params.cartId, req.params.productId]
    );

    res.status(200)
  })
)
 
cartRouter.delete(
  "/:cardId/items/:productId",
  handleAsync(async (req, res, next) => {
    const isProductNotExist = await executeQuery("SELECT * FROM product WHERE id=?;", [req.params.productId]) == '';
    const isCartNotExist = await executeQuery("SELECT * FROM cart WHERE id=?", [req.params.cartId]) == '';

    if(isCartNotExist || isProductNotExist) {
      return res.status(404);
    }

    await executeQuery(
      "DELETE FROM cart_item WHERE id=?",
      [req.params.productId]
    );
  })
);

cartRouter.get(
  "/:id/",
  handleAsync(async (req, res, next) => {
    const cart = await executeQuery("SELECT * FROM `cart` JOIN cart_item ON cart.id = cart_item.cart_id WHERE cart.id = ?;", [req.params.id])

    let price = 0;
    let price2 = 0;

    if(cart == '') {
      return res.status(404);
    }

    const discountedPrice = await executeQuery("SELECT * FROM discount");

    console.log(cart)

    console.log(cart == '')

    cart[0].items.forEach((item) => {
      price += item.quantity * item.price
    });

    cart[0].items.forEach((item) => {
      discountedPrice.forEach((pri) => {
        if(item.product_id == pri.product_id) {
          if(pri.min_purchase_amount <= item.quantity) {
            if(pri.type = 'fixed_amount') {
              price2 += item.quantity * pri.value;
            } else {
              let current = item.quantity * item.price;
              price2 += current - (current / 100 * pri.value)
            }
          } else {
            price2 += item.quantity * item.price
          }
        } else {
          price2 += item.quantity * item.price
        }
      });
    });

    res.status(200).json({ cart, originalPrice: price, discountedPrice: 1 })
  })
)

export { cartRouter };
