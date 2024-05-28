//
// This is the main script.
//
import express from "express";
import { logger } from "./logger.js";
import { sendNotFound } from "./util.js";
import { cartRouter } from "./routes/cart.js";

const app = express();

// Using bodyParser to parse JSON bodies into JS objects.
app.use(express.json());

// log HTTP requests
app.use(logger);

// activate sub-routes
app.use("/api/carts", cartRouter);

// map every other route and return 404
app.use((req, res, next) => sendNotFound(req, res, next));

// add error handler for uncaught errors
app.use("/*", (err, req, res, _next) => {
  console.error("Unknown error occurred:", req.method, req.url, err);
  res.status(500).send({ error: String(err) });
});

// start server
const port = process.argv[2] || 4000;
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
