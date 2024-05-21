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
    res.status(201).json({ 
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

    const product = await executeQuery("SELECT * FROM product WHERE id=?;", [productId]);
    const cart = await executeQuery("SELECT * FROM cart WHERE id=?", [cartId]);

    if(cart == "") {
      return res.status(404).json({ error: "Cart not found" });
    }

    if(product == "") {
      return res.status(404).json({ error: `Product with ID ${productId} not found` })
    }

    if(quantity < 1) {
      return res.status(400).json({ error: "Quantity must be a positive number" })
    }

    if(cart[0].status == "checked out") {
      return res.status(400).json({ error: "Cart is already checked out" })
    }

    await executeQuery("INSERT INTO cart_item(cart_id, product_id, quantity) VALUES (?, ?, ?)", [cartId, productId, quantity])

    res.status(201).json({ message: "Action is successfull" });
  })
);

cartRouter.put(
  "/:cartId/items/:productId", 
  handleAsync(async (req, res, next) => {
    const cart = await executeQuery("SELECT * FROM cart WHERE id=?;", [req.params.cartId])
    const product = await executeQuery("SELECT * FROM product WHERE id=?", [req.params.productId])

    if(req.body.quantity < 1) {
      return res.status(400).json({ error: "Quantity must be a positive number" });
    }

    if(product == '') {
      return res.status(404).json({ error: `Product with ID ${req.params.productId} not found in cart` });
    }

    if(cart == '') {
      return res.status(404).json({ error: "Cart not found" })
    }

    if(cart[0].status == "checked out") {
      return res.status(400).json({ error: "Cart is already checked out" })
    }

    await executeQuery(
      "UPDATE cart_item SET quantity = ? WHERE cart_id=? AND product_id=?;",[req.body.quantity, req.params.cartId, req.params.productId]
    );

    res.status(200).json({ message: "Action is successfull"})
  })
)
 
cartRouter.delete(
  "/:cartId/items/:productId",
  handleAsync(async (req, res, next) => {
    const product = await executeQuery("SELECT * FROM product WHERE id=?;", [req.params.productId]);
    const cart = await executeQuery("SELECT * FROM cart WHERE id=?;", [req.params.cartId])

    if(product == "") {
      return res.status(404).json({ error:  `Product with ID ${req.params.productId} not found in cart` })
    }

    if(cart == '') {
      return res.status(404).json({ error: "Cart not found"})
    }

    if(cart[0].status == "checked out") {
      return res.status(400).json({ error: "Cart is already checked out" })
    }

    await executeQuery(
      "DELETE FROM cart_item WHERE id=?",
      [req.params.productId]
    );

    res.status(200).json({ message: "Action is sucessfull" })
  })
);

cartRouter.get(
  "/:id/",
  handleAsync(async (req, res, next) => {
    const cart = await executeQuery("SELECT * FROM cart JOIN cart_item ON cart.id = cart_item.cart_id JOIN product ON product.id = cart_item.product_id JOIN discount ON discount.product_id = product.id WHERE cart_id = ?;", [req.params.id])

    console.log(cart)

    
    if(cart == '') {
      return res.status(404).json({ error: "Cart not found" })
    }
    
    if(cart.status == "checked out") {
      return res.status(200).json({ message: "Cart not found" })
    }
    
    let price = 0;
    let price2 = 0;

    cart.forEach((item) => {
      price += item.quantity * item.price
      if(item.quantity >= item.min_purchase_amount) {
        if(item.type == 'fixed_amount') {
          price2 += item.quantity * parseInt(item.value)
        } else if(item.type == 'percentage') {
          price2 += (100 - item.value) * item.price / 100
        }
      } else {
        price2 += item.quantity * parseInt(item.price)
      }
    });

    res.status(200).json({ "cartId": cart[0].cart_id, "status": cart[0].status, "items": cart, "originalPrice": price, "discountedPrice": price2 })
  })
)

cartRouter.post(
  "/:id/checkout",
  handleAsync(async (req, res, next) => {
    const cartId = req.params.id;

    const cart = await executeQuery("SELECT * FROM cart WHERE id=?;", [cartId])

    if(cart == '') {
      return res.status(404).json({ error: "Cart not found" })
    }

    if(cart[0].status == "checked out") {
      return res.status(400).json({ error: "Cart is already checked out" })
    }

    await executeQuery("UPDATE cart SET status=? WHERE id=?", ["checked out", cartId])

    res.status(200).json({ message: "Checkout successful. Order placed."})
  })
)

export { cartRouter };
