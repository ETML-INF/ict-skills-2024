//
// This is the main script.
//
import express from "express";
import bodyParser from "body-parser";
import { logger } from "./logger.js";
import { sendNotFound } from "./util.js";
import { exampleRouter } from "./routes/example.js";

const app = express();

// Using bodyParser to parse JSON bodies into JS objects.
app.use(bodyParser.json());

// log HTTP requests
app.use(logger);

// activate sub-routes
app.use("/api/example", exampleRouter);

// map every other route and return 404
app.use("/*", (req, res) => sendNotFound(req, res));

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
