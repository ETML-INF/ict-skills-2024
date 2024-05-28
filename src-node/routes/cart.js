import express from "express"
import { randomUUID } from "crypto";
import { handleAsync } from "../util.js";
import { executeQuery } from "../db.js";

const cartRouter = express();

/**
 * route for creating a cart. Return the code 201 if it's a success.
 */
cartRouter.post(
  "/", 
  handleAsync(async (req, res, next) => {
    // Get a random UID
    const id = randomUUID();
    // Execute a query to create a cart
    await executeQuery(
      "INSERT INTO cart(id, status) VALUES (?, ?)", 
      [id, 'open']
    );
    // Send the sucessfull code the id
    res.status(201).json({ 
      cartId: id 
    });
  })
);

/**
 * Route to post one item into the cart. Return the code 201 if it's a success.
 */
cartRouter.post(
  "/:id/items", 
  handleAsync(async (req, res, next) => {
    // Get the Id and the quantity pass by the users
    const cartId = req.params.id;
    const productId = req.body.productId;
    const quantity = req.body.quantity;

    // Query to know if the find the cart and the product
    const product = await executeQuery("SELECT * FROM product WHERE id=?;", [productId]);
    const cart = await executeQuery("SELECT * FROM cart WHERE id=?", [cartId]);

    // Check if the cart exists if not send an error
    if(cart == "") {
      return res.status(404).json({ error: "Cart not found" });
    }

    // Check if the product exists if he doesn't exists. We send an error
    if(product == "") {
      return res.status(404).json({ error: `Product with ID ${productId} not found` })
    }

    // Check if the quantity is greater than else it's useless actions
    if(quantity < 1) {
      return res.status(400).json({ error: "Quantity must be a positive number" })
    }

    // Check if the status of his cart is checked out if this is right. You cannot add a new items.
    if(cart[0].status == "checked out") {
      return res.status(400).json({ error: "Cart is already checked out" })
    }

    // Do the query to add the item to the cart
    await executeQuery("INSERT INTO cart_item(cart_id, product_id, quantity) VALUES (?, ?, ?)", [cartId, productId, quantity])

    // Give the code 201 et send a message to the user
    res.status(201).json({ message: "Action is successfull" });
  })
);

/**
 * Route to modify the quantity of an item into a cart. Return the code 200 if it's a success.
 */
cartRouter.put(
  "/:cartId/items/:productId", 
  handleAsync(async (req, res, next) => {

    // Get the id and the quantity pass by the users
    const cartId = req.params.cartId
    const productId = req.params.productId
    const quantity = req.body.quantity

    // Do a query to get the cart and the product
    const cart = await executeQuery("SELECT * FROM cart WHERE id=?;", [cartId])
    const product = await executeQuery("SELECT * FROM product WHERE id=?", [productId])

    // Check if the quantity is greater than else it's useless actions
    if(quantity < 1) {
      return res.status(400).json({ error: "Quantity must be a positive number" });
    }

    // Check if the product exists if he doesn't exists. We send an error
    if(product == '') {
      return res.status(404).json({ error: `Product with ID ${productId} not found in cart` });
    }

    // Check if the cart exists if not send an error
    if(cart == '') {
      return res.status(404).json({ error: "Cart not found" })
    }

    // Check if the status of his cart is checked out if this is right. You cannot modify a new items.
    if(cart[0].status == "checked out") {
      return res.status(400).json({ error: "Cart is already checked out" })
    }

    // Do the query to modify the item if no error was found.
    await executeQuery(
      "UPDATE cart_item SET quantity = ? WHERE cart_id=? AND product_id=?;",[quantity, cartId, productId]
    );

    // Give the code 200 and send a sucessfull message.
    res.status(200).json({ message: "Action is successfull"})
  })
)

/**
 * Route to delete an item from a cart. Return the code 200 if it's a success.
 */
cartRouter.delete(
  "/:cartId/items/:productId",
  handleAsync(async (req, res, next) => {

    // Get the different id give by the users
    const productId = req.params.productId;
    const cartId = req.params.cartId;

    // Get the cart and the product from the database
    const product = await executeQuery("SELECT * FROM product WHERE id=?;", [productId]);
    const cart = await executeQuery("SELECT * FROM cart WHERE id=?;", [cartId])

    // Check if the product exists. If it's false you send an error
    if(product == "") {
      return res.status(404).json({ error:  `Product with ID ${productId} not found in cart` })
    }

    // Check if the cart exists if not send an error
    if(cart == '') {
      return res.status(404).json({ error: "Cart not found"})
    }

    // Check if the cart have the status checked out because a cart checked out cannot be modified.
    if(cart[0].status == "checked out") {
      return res.status(400).json({ error: "Cart is already checked out" })
    }

    // Do the query to delete the item from the cart
    await executeQuery(
      "DELETE FROM cart_item WHERE id=?",
      [productId]
    );

    // Give the code 200 and send a sucessfull message.
    res.status(200).json({ message: "Action is sucessfull" })
  })
);

/**
 * Route to get the price of your cart. We send the original price and the discounted price. Return the code 200 if it's a success.
 */
cartRouter.get(
  "/:id/",
  handleAsync(async (req, res, next) => {

    // Get the id of the cart
    const id = req.params.id

    // Do a query to select all the information we need to the discountated price
    const cart = await executeQuery(
      "SELECT * FROM cart JOIN cart_item ON cart.id = cart_item.cart_id JOIN product ON product.id = cart_item.product_id JOIN discount ON discount.product_id = product.id WHERE cart_id = ?;", [id]
    )
    // Do a quey to select the user's cart
    const newCart = await executeQuery("SELECT * FROM cart WHERE id=?;", [id])

    // Check if the cart exist if not send an error
    if(newCart.length == 0) {
      return res.status(404).json({ error: "Cart not found" })
    }

    // Check if the cart is empty if he's empty send the correct value
    if(cart == '' && newCart.length == 1) {
      return res.status(200).json({ cartId: newCart[0].id, status: newCart[0].status, items: [] })
    }
    
    // Check if the cart have the status checked out because a cart checked out cannot be see.
    if(cart.status == "checked out") {
      return res.status(404).json({ message: "Cart not found" })
    }
    
    // Defined the originalPrice and the discounted price
    let price = 0;
    let price2 = 0;

    cart.forEach((item) => {
      // We add the price to the origininalPrice
      price += item.quantity * item.price
      // If the quantity is under the min purchase amount, the user haven't the reduce
      if(item.quantity >= item.min_purchase_amount) {
        // If the type of reduction is fixed_amount we add simply to the discountedPrice
        if(item.type == 'fixed_amount') {
          price2 += item.quantity * parseInt(item.price) - parseInt(item.value)
        // If the type of reduction is pourcentage we do a pourcentage and multiply by the quantity
        } else if(item.type == 'percentage') {
          price2 += ((100 - item.value) * item.price / 100) * item.quantity
        }
      // Not reduction is on the product so we do the same as the original price
      } else {
        price2 += item.quantity * parseInt(item.price)
      }
    });

    // Convert the price to string into an int
    cart[0].price = parseInt(cart[0].price)

    // We return the code 200 and the id of the cart, the status, the items, the originalPrice and the discountedPrice
    res.status(200).json({ "cartId": cart[0].cart_id, "status": cart[0].status, "items": cart, "originalPrice": price, "discountedPrice": price2 })
  })
)

/**
 * Route to change the status open to checked out. Return the code 200 if it's a success.
 */
cartRouter.post(
  "/:id/checkout",
  handleAsync(async (req, res, next) => {

    // Get the id pass by the user
    const cartId = req.params.id;

    // Do a query to get the cart
    const cart = await executeQuery("SELECT * FROM cart WHERE id=?;", [cartId])
    // Do a query to get the item of the cart
    const cart_item = await executeQuery("SELECT * FROM cart_item WHERE cart_id=?;", [cartId])

    // Check if the cart is empty if is empty send an error
    if(cart.length == 1 && cart_item.length == 0) {
      return res.status(400).json({ error: "Cart is empty" })
    }

    // Check if the cart exists if not send an error
    if(cart == '') {
      return res.status(404).json({ error: "Cart not found" })
    }

    // Check if the cart have the status checked out because a cart checked out cannot be modify.
    if(cart[0].status == "checked out") {
      return res.status(400).json({ error: "Cart is already checked out" })
    }

    // Do a query to change the status of the cart to checked out
    await executeQuery("UPDATE cart SET status=? WHERE id=?", ["checked out", cartId])

  // We return the code 200 and a sucessfull message
    res.status(200).json({ message: "Checkout successful. Order placed."})
  })
)

export { cartRouter };
