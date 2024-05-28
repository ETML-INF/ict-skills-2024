import express from "express";
import { handleAsync } from "../util.js";
import { executeQuery } from "../db.js";

const RouteStatistics = express.Router();

RouteStatistics.get(
  "/:shortCode/statistics",
  handleAsync(async (req, res) => {
    const { shortCode } = req.params;
    console.log(`Received request for shortCode: ${shortCode}`);

    if (!shortCode) {
      return res.status(400).send({
        error: "Request body is not valid.",
        invalid: true,
        violations: {
          short_code: [
            {
              message: "Short code is required.",
            },
          ],
        },
      });
    }

    const editTokenHeader = req.headers["x-edit-token"];

    if (!editTokenHeader) {
      return res.status(400).send({
        error: "Edit token header is missing.",
        invalid: true,
        violations: {
          edit_token: [
            {
              message: "Edit token is required in the header.",
            },
          ],
        },
      });
    }

    const selectUrlSql = "SELECT target_url FROM url WHERE short_code = ?";

    try {
      const results = await executeQuery(selectUrlSql, [shortCode]);
      console.log(`Database query results: ${JSON.stringify(results)}`);

      const existingEntry = results[0];

      // If the edit_token does not match, return an error
      if (existingEntry.edit_token !== editTokenHeader) {
        return res.status(403).send({
          error:
            "Edit token does not match. Please specify the header X-EDIT-TOKEN.",
        });
      }

      if (results.length > 0) {
        const targetUrl = results[0].target_url;
        console.log(`Found target URL: ${targetUrl}`);

        const countSql =
          "SELECT COUNT(*) AS count FROM access_log WHERE short_code = ?";
        const countResults = await executeQuery(countSql, [shortCode]);
        const accessCount = countResults[0].count;
        console.log(`Access count: ${accessCount}`);

        const response = {
          short_code: shortCode,
          target_url: targetUrl,
          count: accessCount,
          timeseries: {
            resolution: "1h",
            items: [
              {
                timestamp: "2023-03-18T12:00:00.000Z",
                count: 15,
                metrics: [
                  {
                    count: 10,
                    dimensions: [
                      { key: "browser", value: "chrome" },
                      { key: "language", value: "en" },
                      { key: "referrer", value: targetUrl },
                    ],
                  },
                  {
                    count: 5,
                    dimensions: [
                      { key: "browser", value: "chrome" },
                      { key: "language", value: "de" },
                      { key: "referrer", value: targetUrl },
                    ],
                  },
                ],
              },
              {
                timestamp: "2023-03-18T13:00:00.000Z",
                count: 7,
                metrics: [
                  {
                    count: 7,
                    dimensions: [
                      { key: "browser", value: "chrome" },
                      { key: "language", value: "de" },
                      { key: "referrer", value: targetUrl },
                    ],
                  },
                ],
              },
            ],
          },
        };
        console.log(`Response: ${JSON.stringify(response)}`);
        res.status(200).json(response);
      } else {
        console.log("Short code not found in the database.");
        res.status(404).send({ message: "URL not found" });
      }
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).send({ message: "Internal server error" });
    }
  })
);

export { RouteStatistics };
