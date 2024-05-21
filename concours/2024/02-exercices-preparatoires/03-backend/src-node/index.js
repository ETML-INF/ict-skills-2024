//
// This is the main script.
//
import express from "express";
import bodyParser from "body-parser";
import { logger } from "./logger.js";
import { sendNotFound } from "./util.js";
import { RouteCreate } from "./routes/CreateUrl.js";
import { RouteRedirect } from "./routes/Redirect.js";
import { RouteUpdate } from "./routes/Update.js";
import { RouteStadistics } from "./routes/Stadisitcs.js";
const app = express();

// Using bodyParser to parse JSON bodies into JS objects.
app.use(bodyParser.json());

// log HTTP requests
app.use(logger);

// activate sub-routes
app.use("/s", RouteRedirect);

app.use('/api/url', RouteCreate);

app.use("/api/url/put-test", RouteUpdate);

app.use("/api/url/stats-test", RouteStadistics);

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
